import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import setupSwagger from "./config/swagger.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { deleteExpiredUsers } from "./utils/deleteExpiredUsers.js";

//RUTAS
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
//import storageRouter from "./routes/storage.cjs";
import storageRouter from "./routes/storage.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true, //permite enviar cookies desde el frontend
  })
);

//SWAGGER
setupSwagger(app);

// ✅ Registrar rutas
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/storage", storageRouter);

// middleware para cookies
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
