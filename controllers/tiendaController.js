const Tienda = require('../models/Tienda');

// Mostrar todas las tiendas
exports.getTiendas = async(req, res) => {
    try {
        const tiendas = await Tienda.find();
        res.render('tiendas', { tiendas });
    } catch (error) {
        console.error('Error al obtener tiendas:', error);
        res.status(500).send('Error al obtener tiendas');
    }
};

// Mostrar formulario para crear una nueva tienda
exports.getNuevaTienda = (req, res) => {
    res.render('nuevaTienda');
};

// Crear una nueva tienda
exports.createTienda = async(req, res) => {
    try {
        const nuevaTienda = new Tienda(req.body);
        await nuevaTienda.save();
        res.redirect('/tiendas');
    } catch (error) {
        console.error('Error al crear tienda:', error);
        res.status(500).send('Error al crear tienda');
    }
};

// Mostrar formulario para editar una tienda
exports.editarTienda = async(req, res) => {
    try {
        const tienda = await Tienda.findById(req.params.id);
        if (!tienda) {
            return res.status(404).render('error', { error: 'Tienda no encontrada' });
        }
        // Actualiza la tienda con los datos del formulario
        tienda.nombre = req.body.nombre;
        tienda.direccion = req.body.direccion;
        tienda.telefono = req.body.telefono;
        await tienda.save();
        res.redirect('/tiendas?success=Tienda actualizada correctamente');
    } catch (error) {
        console.error('Error al editar la tienda:', error);
        res.status(500).render('error', { error: 'Error al actualizar la tienda' });
    }
};


// Actualizar los datos de una tienda
// Actualizar tienda
exports.updateTienda = async(req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID de la tienda desde los parámetros
        const { nombre, direccion, telefono } = req.body; // Obtenemos los datos del formulario

        // Actualizamos la tienda con los nuevos datos
        const tiendaActualizada = await Tienda.findByIdAndUpdate(id, { nombre, direccion, telefono }, { new: true });

        if (!tiendaActualizada) {
            return res.status(404).send('Tienda no encontrada');
        }

        res.redirect('/tiendas'); // Redirige a la lista de tiendas después de la actualización
    } catch (error) {
        console.error('Error al actualizar tienda:', error);
        res.status(500).send('Error al actualizar tienda');
    }
};



// Eliminar tienda
exports.eliminarTienda = async(req, res) => {
    try {
        await Tienda.findByIdAndDelete(req.params.id);
        res.redirect('/tiendas?success=Tienda eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar la tienda:', error);
        res.status(500).render('error', { error: 'Error al eliminar la tienda' });
    }
};