import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import setupSwagger from "./config/swagger.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { deleteExpiredUsers } from "./utils/deleteExpiredUsers.js";

// Importamos las rutas centralizadas
import routes from "./routes/index.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true, // Permite enviar cookies desde el frontend
  })
);

// SWAGGER
setupSwagger(app);

// ✅ Usamos las rutas centralizadas
app.use("/api", routes);

// Middleware para cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

// Ejecutar cada 5 minutos en segundo plano
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Verificando usuarios no verificados...");
  await deleteExpiredUsers();
});
