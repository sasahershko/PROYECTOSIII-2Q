import { version } from 'mongoose';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const swaggerOptions = {
    definition:{
        openapi: "3.0.0", //versión de openapi
        info:{ //aquí hay metadatos (nombre de la API, la versión y descripción)
            title: 'API Project Center',
            version: '1.0.0', //esto se modifica en caso de que hayan cambios importantes 
            description: 'Documentación de la API con swagger'
        },
        servers:[
            {
                url: 'http://localhost:5000'
            }
        ]
    },
    apis: ['./routes/*.js']
}

// generamos la documentación, pasandole la config anterior -> esto te devuelve un objeto con toda la documentación generada automáticamente
const swaggerDocs = swaggerJsDoc(swaggerOptions); 

const setupSwagger = (app) =>{
    //registra swagger en express. 1. define la ruta, 2. sirve la documentación (html, css, js), 3. la muestra en la interfaz de swagger
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
    console.log('CREADO -> acceder en http://localhost:5000/api-docs');
}

export default setupSwagger;