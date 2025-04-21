import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

/**
 * Configuración de Swagger para la documentación de la API
 */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios y Proyectos",
      version: "1.0.0",
      description: "Documentación de la API para gestionar usuarios y proyectos",
    },
    servers: [
      {
        url: process.env.BACKEND_URL || "http://localhost:5000",
        description: "Testing Local",
      },
      {
        url: "https://surviving-poppy-sasahershko-72589d6b.koyeb.app",
        description: "Develop",
      },
    ],
  },
  apis: ["./routes/*.js"], // Aquí Swagger escanea los archivos de rutas para documentar
};

/**
 * Función para configurar Swagger en la aplicación Express
 * @param {object} app - La instancia de Express
 */
const setupSwagger = (app) => {
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

  console.log("📄 Swagger UI disponible en: http://localhost:5000/api-docs");
};

export default setupSwagger;