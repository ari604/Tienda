const Cliente = require('../models/Cliente');


// Mostrar todos los clientes
exports.getClientes = async(req, res) => {
    try {
        const clientes = await Cliente.find(); // Asegúrate de que se obtienen todos los campos
        res.render('clientes', { clientes });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).send('Error al obtener clientes');
    }
};

// Mostrar formulario para crear un nuevo cliente
exports.getNuevoCliente = (req, res) => {
    res.render('nuevoCliente', { error: null });
};

exports.createCliente = async(req, res) => {
    try {
        const { nombre, direccion, email } = req.body;

        // Asegurarse de que los campos sean proporcionados
        if (!direccion || !email) {
            return res.status(400).render('nuevoCliente', {
                error: 'Todos los campos son obligatorios',
            });
        }

        // Verificar si el correo ya está registrado
        const clienteExistente = await Cliente.findOne({ email });
        if (clienteExistente) {
            return res.status(400).render('nuevoCliente', {
                error: 'El correo electrónico ya está registrado',
            });
        }

        // Crear el cliente si no existe un correo duplicado
        const nuevoCliente = new Cliente({ nombre, direccion, email });
        await nuevoCliente.save();
        res.redirect('/clientes');
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).render('nuevoCliente', { error: 'Error al crear cliente' });
    }
};


// Mostrar formulario para editar un cliente
exports.getEditarCliente = async(req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        res.render('editarCliente', { cliente });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).send('Error al obtener cliente');
    }
};

// Actualizar los datos de un cliente
// controllers/clienteController.js


exports.updateCliente = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, email } = req.body;

        if (!nombre || !direccion || !email) {
            return res.redirect(`/clientes/editar/${id}?error=Todos los campos son requeridos`);
        }

        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id, { nombre, direccion, email }, { new: true, runValidators: true } // Opciones importantes para devolver el cliente actualizado y validar
        );

        if (!clienteActualizado) {
            return res.redirect(`/clientes?error=Cliente no encontrado`);
        }

        res.redirect('/clientes?success=Cliente actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.redirect(`/clientes/editar/${id}?error=No se pudo actualizar el cliente`);
    }
};



// Eliminar un cliente
exports.deleteCliente = async(req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.redirect('/clientes');
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).send('Error al eliminar cliente');
    }
};