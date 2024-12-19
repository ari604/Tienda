// controllers/bebidaController.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bebida = require('../models/Bebida');
const isAuthenticated = require('../middleware/isAuthenticated');

// Mostrar la lista de bebidas
router.get('/bebidas', isAuthenticated, async(req, res) => {
    try {
        const bebidas = await Bebida.find().sort({ nombre: 1 });
        res.render('index', { bebidas });
    } catch (error) {
        console.error('Error al cargar bebidas:', error);
        res.status(500).render('error', { error: 'Error al cargar la lista de bebidas' });
    }
});

router.get('/bebidas/edit/:id', isAuthenticated, async(req, res) => {
    try {
        const bebida = await Bebida.findById(req.params.id);
        if (!bebida) {
            return res.status(404).send('Bebida no encontrada');
        }
        res.render('list', { bebida });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});

router.post('/bebidas', isAuthenticated, async(req, res) => {
    try {
        const nuevaBebida = new Bebida(req.body);
        await nuevaBebida.save();
        res.redirect('/bebidas?success=Bebida agregada correctamente');
    } catch (error) {
        console.error('Error al agregar bebida:', error);
        res.status(500).send('Error al agregar bebida');
    }
});

router.put('/bebidas/:id', isAuthenticated, async(req, res) => {
    try {
        const bebidaActualizada = await Bebida.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bebidaActualizada) {
            return res.status(404).json({ error: 'Bebida no encontrada' });
        }
        res.redirect('/bebidas?success=Bebida actualizada correctamente');
    } catch (error) {
        console.error('Error al actualizar bebida:', error);
        res.status(500).json({ error: 'Error al actualizar bebida' });
    }
});

router.delete('/bebidas/:identifier', isAuthenticated, async(req, res) => {
    try {
        const identifier = req.params.identifier.trim();
        let bebidaEliminada;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            bebidaEliminada = await Bebida.findByIdAndDelete(identifier);
        }
        if (!bebidaEliminada) {
            bebidaEliminada = await Bebida.findOneAndDelete({ codigo: identifier });
        }
        if (!bebidaEliminada) {
            return res.status(404).json({ error: 'Bebida no encontrada' });
        }
        res.redirect('/bebidas?success=Bebida eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar bebida:', error);
        res.status(500).json({ error: 'Error de servidor', details: error.message });
    }
});

module.exports = router;