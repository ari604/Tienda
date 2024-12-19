// models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true }, // Asegurarse de que 'direccion' esté marcado como 'required'
    email: { type: String, required: true }, // Asegurarse de que 'email' esté marcado como 'required'
});

module.exports = mongoose.model('Cliente', clienteSchema);