// ─── MOVIMIENTOS ───────────────────────────────────────────
const express = require('express');
const routerMov = express.Router();
const ctrlMov = require('../controllers/movimientosController');
const { autenticar, soloEntradas } = require('../middleware/auth');

routerMov.use(autenticar);
routerMov.get('/',     ctrlMov.obtenerTodos);
routerMov.get('/:id',  ctrlMov.obtenerPorId);
routerMov.post('/',    soloEntradas, ctrlMov.crear);

// ─── USUARIOS ──────────────────────────────────────────────
const routerUser = express.Router();
const ctrlUser = require('../controllers/usuariosController');
const { soloAdmin } = require('../middleware/auth');

routerUser.post('/login', ctrlUser.login);                        // Login (público)
routerUser.get('/',       autenticar, soloAdmin, ctrlUser.obtenerTodos);
routerUser.get('/:id',    autenticar, soloAdmin, ctrlUser.obtenerPorId);
routerUser.post('/',      autenticar, soloAdmin, ctrlUser.crear);
routerUser.delete('/:id', autenticar, soloAdmin, ctrlUser.eliminar);

// ─── REPORTES ──────────────────────────────────────────────
const routerRep = express.Router();
const ctrlRep = require('../controllers/reportesController');

routerRep.use(autenticar);
routerRep.get('/resumen',            ctrlRep.resumen);
routerRep.get('/stock-por-categoria',ctrlRep.stockPorCategoria);
routerRep.get('/alertas',            ctrlRep.alertas);
routerRep.get('/top-movimientos',    ctrlRep.topMovimientos);

module.exports = { routerMov, routerUser, routerRep };
