import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();



const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
    .then(() => {
        console.log('Conexion DB exitosa');
    }).catch(err => {
        console.error(err);
    });