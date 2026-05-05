const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productosController');
const { autenticar, soloAdmin } = require('../middleware/auth');

// Todas las rutas de productos requieren autenticación
router.use(autenticar);

router.get('/',      ctrl.obtenerTodos);   // Listar todos (con filtros opcionales)
router.get('/:id',   ctrl.obtenerPorId);   // Obtener uno por ID
router.post('/',     ctrl.crear);          // Crear nuevo (admin y empleado)
router.put('/:id',   soloAdmin, ctrl.actualizar); // Actualizar (solo admin)
router.delete('/:id',soloAdmin, ctrl.eliminar);   // Eliminar (solo admin)

module.exports = router;
