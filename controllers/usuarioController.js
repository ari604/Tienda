// controllers/usuarioController.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para procesar el registro
router.post('/register', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ username });
        if (usuarioExistente) {
            return res.status(400).send('El nombre de usuario ya está en uso');
        }

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({ username, password });
        await nuevoUsuario.save();

        res.redirect('/login?success=Usuario registrado correctamente');
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send('Error en el registro de usuario');
    }
});

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para procesar el login
router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });

        if (!usuario) {
            return res.status(401).send('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(401).send('Contraseña incorrecta');
        }

        req.session.user = {
            id: usuario._id,
            username: usuario.username
        };

        res.redirect('/bebidas');
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error en el inicio de sesión');
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

module.exports = router;