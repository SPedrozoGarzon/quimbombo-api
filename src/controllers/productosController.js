const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../data/productos.json');

function leer() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function guardar(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}
function generarCodigo(productos) {
  const num = productos.length + 1;
  return 'QB' + String(num).padStart(4, '0');
}

// GET /api/productos
const obtenerTodos = (req, res) => {
  const productos = leer();
  const activos = productos.filter(p => p.activo);

  // Filtros opcionales por query
  const { categoria, stockBajo } = req.query;
  let resultado = activos;

  if (categoria) {
    resultado = resultado.filter(p =>
      p.categoria.toLowerCase().includes(categoria.toLowerCase())
    );
  }
  if (stockBajo === 'true') {
    resultado = resultado.filter(p => p.stock <= p.stockMinimo);
  }

  res.json({
    exito: true,
    total: resultado.length,
    datos: resultado
  });
};

// GET /api/productos/:id
const obtenerPorId = (req, res) => {
  const productos = leer();
  const producto = productos.find(p => p.id === req.params.id && p.activo);

  if (!producto) {
    return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
  }
  res.json({ exito: true, datos: producto });
};

// POST /api/productos
const crear = (req, res) => {
  const { nombre, categoria, unidad, stock, stockMinimo, precio, descripcion } = req.body;

  if (!nombre || !categoria || !unidad) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Campos requeridos: nombre, categoria, unidad'
    });
  }

  const productos = leer();
  const nuevo = {
    id: uuidv4(),
    codigo: generarCodigo(productos),
    nombre,
    categoria,
    unidad,
    stock: Number(stock) || 0,
    stockMinimo: Number(stockMinimo) || 0,
    precio: Number(precio) || 0,
    descripcion: descripcion || '',
    activo: true,
    fechaRegistro: new Date().toISOString().split('T')[0]
  };

  productos.push(nuevo);
  guardar(productos);

  res.status(201).json({
    exito: true,
    mensaje: 'Producto creado exitosamente',
    datos: nuevo
  });
};

// PUT /api/productos/:id
const actualizar = (req, res) => {
  const productos = leer();
  const idx = productos.findIndex(p => p.id === req.params.id && p.activo);

  if (idx === -1) {
    return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
  }

  const camposPermitidos = ['nombre', 'categoria', 'unidad', 'stockMinimo', 'precio', 'descripcion'];
  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      productos[idx][campo] = req.body[campo];
    }
  });

  guardar(productos);
  res.json({
    exito: true,
    mensaje: 'Producto actualizado',
    datos: productos[idx]
  });
};

// DELETE /api/productos/:id  (solo admin)
const eliminar = (req, res) => {
  const productos = leer();
  const idx = productos.findIndex(p => p.id === req.params.id && p.activo);

  if (idx === -1) {
    return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
  }

  // Eliminación lógica
  productos[idx].activo = false;
  guardar(productos);

  res.json({ exito: true, mensaje: 'Producto eliminado correctamente' });
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
