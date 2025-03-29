import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import setupSwagger from "./config/swagger.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import deleteExpiredUnverifiedUsers from "./utils/deleteExpiredUnverifiedUsers.js";

// Importamos las rutas
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(cookieParser());
setupSwagger(app);
app.use("/api", routes);
app.get("/", (req, res) => res.send("🚀 API funcionando correctamente"));

// ✅ Conectar DB y lanzar servidor cuando esté lista
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.clear();
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`✅ Conexion exitosa`);
  });

  // 🔄 Ejecutar el cron una vez conectados
  cron.schedule("*/5 * * * *", async () => {
    console.log("🔄 Verificando usuarios no verificados...");
    await deleteExpiredUnverifiedUsers();
  });
});
