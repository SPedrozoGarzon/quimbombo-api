const fs = require('fs');
const path = require('path');

const DB_PROD = path.join(__dirname, '../data/productos.json');
const DB_MOV  = path.join(__dirname, '../data/movimientos.json');

function leerProds() { return JSON.parse(fs.readFileSync(DB_PROD, 'utf8')).filter(p => p.activo); }
function leerMovs()  { return JSON.parse(fs.readFileSync(DB_MOV,  'utf8')); }

// GET /api/reportes/resumen
const resumen = (req, res) => {
  const prods = leerProds();
  const movs  = leerMovs();

  const totalEntradas = movs.filter(m => m.tipo === 'entrada').reduce((s, m) => s + m.cantidad, 0);
  const totalSalidas  = movs.filter(m => m.tipo === 'salida').reduce((s, m) => s + m.cantidad, 0);
  const valorInventario = prods.reduce((s, p) => s + (p.stock * p.precio), 0);

  res.json({
    exito: true,
    datos: {
      totalProductos:    prods.length,
      productosSinStock: prods.filter(p => p.stock <= 0).length,
      productosStockBajo: prods.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length,
      totalMovimientos:  movs.length,
      totalEntradas,
      totalSalidas,
      balanceUnidades:   totalEntradas - totalSalidas,
      valorInventario
    }
  });
};

// GET /api/reportes/stock-por-categoria
const stockPorCategoria = (req, res) => {
  const prods = leerProds();
  const cats = {};
  prods.forEach(p => {
    if (!cats[p.categoria]) cats[p.categoria] = { categoria: p.categoria, totalStock: 0, totalProductos: 0, valorTotal: 0 };
    cats[p.categoria].totalStock     += p.stock;
    cats[p.categoria].totalProductos += 1;
    cats[p.categoria].valorTotal     += p.stock * p.precio;
  });

  res.json({ exito: true, datos: Object.values(cats).sort((a, b) => b.totalStock - a.totalStock) });
};

// GET /api/reportes/alertas
const alertas = (req, res) => {
  const prods = leerProds();
  const sinStock   = prods.filter(p => p.stock <= 0);
  const stockBajo  = prods.filter(p => p.stock > 0 && p.stock <= p.stockMinimo);

  res.json({
    exito: true,
    datos: {
      sinStock:   { cantidad: sinStock.length,  productos: sinStock },
      stockBajo:  { cantidad: stockBajo.length, productos: stockBajo }
    }
  });
};

// GET /api/reportes/top-movimientos
const topMovimientos = (req, res) => {
  const movs = leerMovs();
  const conteo = {};
  movs.forEach(m => {
    if (!conteo[m.productoId]) conteo[m.productoId] = { productoId: m.productoId, nombre: m.nombreProducto, totalMovimientos: 0, entradas: 0, salidas: 0 };
    conteo[m.productoId].totalMovimientos++;
    if (m.tipo === 'entrada') conteo[m.productoId].entradas++;
    else                      conteo[m.productoId].salidas++;
  });

  const top = Object.values(conteo).sort((a, b) => b.totalMovimientos - a.totalMovimientos).slice(0, 5);
  res.json({ exito: true, datos: top });
};

module.exports = { resumen, stockPorCategoria, alertas, topMovimientos };
