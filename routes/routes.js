// routes/routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

// Rutas de la API manejadas por el controlador
router.get('/reservas', controller.listarYFiltrarReservas);
router.post('/reservas', controller.crearReserva);
router.get('/reservas/:id', controller.obtenerReservaPorId);
router.put('/reservas/:id', controller.actualizarReserva);
router.delete('/reservas/:id', controller.eliminarReserva);

module.exports = router;
