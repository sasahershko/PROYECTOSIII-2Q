import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import setupSwagger from "./config/swagger.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import deleteExpiredUnverifiedUsers from "./utils/deleteExpiredUnverifiedUsers.js";

// Importamos las rutas centralizadas
import routes from "./routes/index.js";

connectDB();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Configuración de CORS para permitir envío de cookies desde frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Configura el origen permitido
    credentials: true,
  })
);

// Middleware para manejar cookies
app.use(cookieParser());

// 🔹 Configuración de Swagger (Documentación API)
setupSwagger(app);

// ✅ Usamos las rutas centralizadas
app.use("/api", routes);

// Ruta de prueba para verificar si el servidor está funcionando
app.get("/", (req, res) => {
  res.send("🚀 API funcionando correctamente");
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

// 🔄 CRON JOB: Eliminar usuarios no verificados cada 5 minutos
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Verificando usuarios no verificados...");
  await deleteExpiredUnverifiedUsers();
});
