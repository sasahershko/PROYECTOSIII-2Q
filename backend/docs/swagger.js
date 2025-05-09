import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import schemas from "./schemas.js";

const localServer = {
  url: "http://localhost:5000",
  description: "🔧 Localhost para testing",
};

const koyebServer = {
  url: "https://surviving-poppy-sasahershko-72589d6b.koyeb.app",
  description: "🚀 Koyeb - Develop",
};

// Ambos servidores, pero ponemos el local arriba si estamos en desarrollo
const servers =
  process.env.NODE_ENV === "development"
    ? [localServer, koyebServer]
    : [koyebServer, localServer];

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Proyect Center - Express API",
      version: "1.0.0",
      description: "Documentación de la API usando Express y Swagger",
    },
    servers,
    components: {
      schemas, // 👈 importado desde schemas.js
    },
  },
  apis: ["./routes/*.js"],
};

const setupSwagger = (app) => {
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  console.log("📄 Swagger UI disponible en: /api-docs");
};

export default setupSwagger;
