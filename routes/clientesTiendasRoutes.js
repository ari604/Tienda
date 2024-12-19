const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const tiendaController = require('../controllers/tiendaController');
const methodOverride = require('method-override');
const Tienda = require('../models/Tienda'); // Asegúrate de importar el modelo Tienda
const isAuthenticated = require('../middleware/isAuthenticated');

// Rutas de Clientes
router.get('/clientes', clienteController.getClientes);
router.get('/clientes/nuevo', clienteController.getNuevoCliente);
router.post('/clientes', clienteController.createCliente);
router.get('/clientes/editar/:id', clienteController.getEditarCliente);
router.put('/clientes/editar/:id', clienteController.updateCliente);
router.delete('/clientes/eliminar/:id', clienteController.deleteCliente);

// Rutas de Tiendas
router.get('/tiendas', tiendaController.getTiendas);
router.get('/tiendas/nueva', tiendaController.getNuevaTienda);
router.post('/tiendas', tiendaController.createTienda);
router.get('/tiendas/editar/:id', isAuthenticated, async(req, res) => {
    try {
        const tienda = await Tienda.findById(req.params.id);
        if (!tienda) {
            return res.status(404).render('error', { error: 'Tienda no encontrada' });
        }
        res.render('editarTienda', { tienda });
    } catch (error) {
        console.error('Error al obtener la tienda:', error);
        res.status(500).render('error', { error: 'Error al cargar la tienda' });
    }
});

router.put('/tiendas/:id', isAuthenticated, async(req, res) => {
    try {
        const tienda = await Tienda.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tienda) {
            return res.status(404).render('error', { error: 'Tienda no encontrada' });
        }
        res.redirect('/tiendas?success=Tienda actualizada correctamente');
    } catch (error) {
        console.error('Error al actualizar la tienda:', error);
        res.status(500).render('error', { error: 'Error al actualizar la tienda' });
    }
});

// Ruta para eliminar tienda
router.delete('/tiendas/:id', isAuthenticated, async(req, res) => {
    try {
        await Tienda.findByIdAndDelete(req.params.id);
        res.redirect('/tiendas?success=Tienda eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar la tienda:', error);
        res.status(500).render('error', { error: 'Error al eliminar la tienda' });
    }
});

// Middleware de methodOverride para PUT y DELETE en formularios
router.use(methodOverride('_method'));

module.exports = router;