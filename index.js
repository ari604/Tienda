const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const Bebida = require('./models/Bebida');
const isAuthenticated = require('./middleware/isAuthenticated');
const clienteController = require('./controllers/clienteController');
const tiendaController = require('./controllers/tiendaController');
const usuarioController = require('./controllers/usuarioController');
const bebidaController = require('./controllers/bebidaController');
const router = require('./routes/clientesTiendasRoutes'); // Aquí importamos el archivo de rutas


// Inicializar express
const app = express();

// Conectar a la base de datos
require('./config/db');

// Configuración de la sesión
app.use(session({
    secret: 'secret-key-bebidas-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true si usas HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configuración de EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar datos del formulario y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para permitir PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.success = req.query.success;
    res.locals.error = req.query.error;
    next();
});

// Rutas
app.use('/', router); // Usamos el router que contiene las rutas de clientes y tiendas
app.use('/', usuarioController);
app.use('/', bebidaController);

// Rutas específicas para bebidas (protegidas por autenticación)
app.get('/bebidas/nuevo', isAuthenticated, (req, res) => {
    res.render('nuevo');
});

app.get('/bebidas/modificar', isAuthenticated, async(req, res) => {
    try {
        const bebidas = await Bebida.find().sort({ nombre: 1 });
        res.render('edit', { bebidas });
    } catch (error) {
        console.error('Error obteniendo bebidas:', error);
        res.status(500).render('error', { error: 'Error al cargar las bebidas' });
    }
});



// Ruta para ver detalles de una bebida
app.get('/bebidas/detalle/:id', isAuthenticated, async(req, res) => {
    try {
        const bebida = await Bebida.findById(req.params.id);
        if (!bebida) {
            return res.status(404).render('error', { error: 'Bebida no encontrada' });
        }
        res.render('detalle', { bebida });
    } catch (error) {
        console.error('Error al obtener detalles de la bebida:', error);
        res.status(500).render('error', { error: 'Error al cargar los detalles' });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.redirect('/bebidas');
});

// Middleware de manejo de errores
app.use((req, res, next) => {
    res.status(404).render('error', { error: 'Página no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});