const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_MOV  = path.join(__dirname, '../data/movimientos.json');
const DB_PROD = path.join(__dirname, '../data/productos.json');

function leerMovs()  { return JSON.parse(fs.readFileSync(DB_MOV,  'utf8')); }
function leerProds() { return JSON.parse(fs.readFileSync(DB_PROD, 'utf8')); }
function guardarMovs(d)  { fs.writeFileSync(DB_MOV,  JSON.stringify(d, null, 2), 'utf8'); }
function guardarProds(d) { fs.writeFileSync(DB_PROD, JSON.stringify(d, null, 2), 'utf8'); }

// GET /api/movimientos
const obtenerTodos = (req, res) => {
  const movs = leerMovs();
  const { tipo, productoId, desde, hasta } = req.query;
  let resultado = movs;

  if (tipo)       resultado = resultado.filter(m => m.tipo === tipo);
  if (productoId) resultado = resultado.filter(m => m.productoId === productoId);
  if (desde)      resultado = resultado.filter(m => m.fecha >= desde);
  if (hasta)      resultado = resultado.filter(m => m.fecha <= hasta);

  res.json({ exito: true, total: resultado.length, datos: resultado });
};

// GET /api/movimientos/:id
const obtenerPorId = (req, res) => {
  const mov = leerMovs().find(m => m.id === req.params.id);
  if (!mov) return res.status(404).json({ exito: false, mensaje: 'Movimiento no encontrado' });
  res.json({ exito: true, datos: mov });
};

// POST /api/movimientos
const crear = (req, res) => {
  const { tipo, productoId, cantidad, fecha, observaciones } = req.body;

  if (!tipo || !productoId || !cantidad || !fecha) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Campos requeridos: tipo, productoId, cantidad, fecha'
    });
  }
  if (!['entrada', 'salida'].includes(tipo)) {
    return res.status(400).json({
      exito: false,
      mensaje: 'El tipo debe ser "entrada" o "salida"'
    });
  }

  const productos = leerProds();
  const idxProd = productos.findIndex(p => p.id === productoId && p.activo);

  if (idxProd === -1) {
    return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
  }

  const cant = Number(cantidad);
  if (cant <= 0) {
    return res.status(400).json({ exito: false, mensaje: 'La cantidad debe ser mayor a 0' });
  }

  if (tipo === 'salida' && productos[idxProd].stock < cant) {
    return res.status(400).json({
      exito: false,
      mensaje: `Stock insuficiente. Disponible: ${productos[idxProd].stock}`
    });
  }

  // Actualizar stock
  if (tipo === 'entrada') productos[idxProd].stock += cant;
  else                    productos[idxProd].stock -= cant;
  guardarProds(productos);

  const nuevo = {
    id: uuidv4(),
    tipo,
    productoId,
    nombreProducto: productos[idxProd].nombre,
    cantidad: cant,
    fecha,
    responsable: req.usuario.username,
    observaciones: observaciones || ''
  };

  const movs = leerMovs();
  movs.unshift(nuevo);
  guardarMovs(movs);

  res.status(201).json({
    exito: true,
    mensaje: `${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente`,
    datos: nuevo,
    stockActual: productos[idxProd].stock
  });
};

module.exports = { obtenerTodos, obtenerPorId, crear };
