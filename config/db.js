// config/db.js
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://ibarraariana07:eaajvr7rJJrSQWGr@cluster0.2wfps.mongodb.net/Tienda';

mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((error) => {
        console.error('Error conectando a MongoDB:', error);
    });