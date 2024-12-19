// models/Bebida.js
const mongoose = require('mongoose');

const bebidaSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    marca: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true } // Por ejemplo: refresco, agua, cerveza, etc.
});

module.exports = mongoose.model('Bebida', bebidaSchema);