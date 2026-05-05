const fs = require('fs');
const path = require('path');

const DB_USUARIOS = path.join(__dirname, '../data/usuarios.json');

function leerUsuarios() {
  return JSON.parse(fs.readFileSync(DB_USUARIOS, 'utf8'));
}

// Middleware: verificar que el usuario existe y está activo
// Para simplificar (sin JWT), usamos header: x-username y x-password
function autenticar(req, res, next) {
  const username = req.headers['x-username'];
  const password = req.headers['x-password'];

  if (!username || !password) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Credenciales requeridas. Envía los headers: x-username y x-password'
    });
  }

  const usuarios = leerUsuarios();
  const usuario = usuarios.find(
    u => u.username === username && u.password === password && u.activo
  );

  if (!usuario) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Usuario o contraseña incorrectos'
    });
  }

  // Adjuntar usuario al request para usarlo en los controladores
  req.usuario = usuario;
  next();
}

// Middleware: solo administradores
function soloAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({
      exito: false,
      mensaje: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
}

// Middleware: solo pueden registrar entradas (empleados y admin)
function soloEntradas(req, res, next) {
  const tipo = req.body.tipo;
  if (req.usuario.rol === 'empleado' && tipo === 'salida') {
    return res.status(403).json({
      exito: false,
      mensaje: 'Los empleados no pueden registrar salidas de inventario'
    });
  }
  next();
}

module.exports = { autenticar, soloAdmin, soloEntradas };
