const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.variables' });

const connectMongo = process.env.DB_USER ? `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}` : "mongodb://localhost/";
console.log(connectMongo);
const ConnectionDB = async () => {
    // MongoDB connection
    mongoose.connect(connectMongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_DATABASE
    }).then(() => console.log('Connected to MongoDB'))
    .catch(err => { 
        console.error(err) ;
        process.exit(1);
    });
}
module.exports = ConnectionDB;