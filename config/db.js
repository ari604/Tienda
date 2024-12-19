// config/db.js
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://er663699:24688642@cluster0.alhgo.mongodb.net/Tienda';

mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((error) => {
        console.error('Error conectando a MongoDB:', error);
    });