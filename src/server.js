const express = require('express');
const cors    = require('cors');
const app     = express();
const PORT    = process.env.PORT || 3000;

// ── Middlewares globales
app.use(cors());
app.use(express.json());

// ── Rutas
const productosRouter            = require('./routes/productos');
const { routerMov, routerUser, routerRep } = require('./routes/otros');

app.use('/api/productos',   productosRouter);
app.use('/api/movimientos', routerMov);
app.use('/api/usuarios',    routerUser);
app.use('/api/auth',        routerUser);   // alias para login
app.use('/api/reportes',    routerRep);

// ── Ruta raíz — información de la API
app.get('/', (req, res) => {
  res.json({
    nombre:      'QUIMBOMBO API',
    version:     '1.0.0',
    descripcion: 'API REST para el sistema de inventario de frutos secos y snacks saludables',
    empresa:     'QUIMBOMBO',
    endpoints: {
      auth:         'POST /api/usuarios/login',
      productos:    '/api/productos',
      movimientos:  '/api/movimientos',
      usuarios:     '/api/usuarios',
      reportes:     '/api/reportes'
    },
    autenticacion: 'Headers requeridos: x-username y x-password (excepto /login)',
    estado: 'activo'
  });
});

// ── 404 handler
app.use((req, res) => {
  res.status(404).json({ exito: false, mensaje: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// ── Arranque
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════╗');
  console.log('║     QUIMBOMBO API - v1.0.0         ║');
  console.log(`║  Servidor activo en puerto ${PORT}    ║`);
  console.log('╚════════════════════════════════════╝');
  console.log('\n Endpoints disponibles:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  POST http://localhost:${PORT}/api/usuarios/login`);
  console.log(`  GET  http://localhost:${PORT}/api/productos`);
  console.log(`  GET  http://localhost:${PORT}/api/reportes/resumen`);
});

module.exports = app;
