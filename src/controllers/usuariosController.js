const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../data/usuarios.json');

function leer()       { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function guardar(d)   { fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2), 'utf8'); }

// POST /api/auth/login
const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ exito: false, mensaje: 'username y password son requeridos' });
  }

  const usuarios = leer();
  const usuario = usuarios.find(u => u.username === username && u.password === password && u.activo);

  if (!usuario) {
    return res.status(401).json({ exito: false, mensaje: 'Credenciales incorrectas' });
  }

  const { password: _, ...usuarioSinPass } = usuario;
  res.json({
    exito: true,
    mensaje: 'Inicio de sesión exitoso',
    datos: usuarioSinPass
  });
};

// GET /api/usuarios  (solo admin)
const obtenerTodos = (req, res) => {
  const usuarios = leer().map(({ password, ...u }) => u);
  res.json({ exito: true, total: usuarios.length, datos: usuarios });
};

// GET /api/usuarios/:id  (solo admin)
const obtenerPorId = (req, res) => {
  const usuario = leer().find(u => u.id === req.params.id);
  if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
  const { password, ...sinPass } = usuario;
  res.json({ exito: true, datos: sinPass });
};

// POST /api/usuarios  (solo admin)
const crear = (req, res) => {
  const { nombre, username, password, rol } = req.body;

  if (!nombre || !username || !password || !rol) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Campos requeridos: nombre, username, password, rol'
    });
  }
  if (!['admin', 'empleado'].includes(rol)) {
    return res.status(400).json({ exito: false, mensaje: 'Rol inválido. Usa: admin o empleado' });
  }
  if (password.length < 6) {
    return res.status(400).json({ exito: false, mensaje: 'La contraseña debe tener mínimo 6 caracteres' });
  }

  const usuarios = leer();
  if (usuarios.find(u => u.username === username)) {
    return res.status(409).json({ exito: false, mensaje: 'El username ya está en uso' });
  }

  const nuevo = {
    id: uuidv4(),
    nombre,
    username,
    password,
    rol,
    activo: true,
    fechaCreacion: new Date().toISOString().split('T')[0]
  };

  usuarios.push(nuevo);
  guardar(usuarios);

  const { password: _, ...sinPass } = nuevo;
  res.status(201).json({ exito: true, mensaje: 'Usuario creado exitosamente', datos: sinPass });
};

// DELETE /api/usuarios/:id  (solo admin)
const eliminar = (req, res) => {
  const usuarios = leer();
  const idx = usuarios.findIndex(u => u.id === req.params.id);

  if (idx === -1) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
  if (usuarios[idx].username === 'admin') {
    return res.status(403).json({ exito: false, mensaje: 'No se puede eliminar el administrador principal' });
  }

  usuarios[idx].activo = false;
  guardar(usuarios);
  res.json({ exito: true, mensaje: 'Usuario desactivado correctamente' });
};

module.exports = { login, obtenerTodos, obtenerPorId, crear, eliminar };
