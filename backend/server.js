import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import setupSwagger from "./config/swagger.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

//SWAGGER
setupSwagger(app);

// ✅ Registrar rutas de usuarios
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
