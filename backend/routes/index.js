import express from "express";
import userRouter from "./userRoutes.js";
import projectRouter from "./projectRoutes.js";
import storageRouter from "./storage.js";

const routes = express.Router();

// Registrar todas las rutas aquí
routes.use("/users", userRouter);
routes.use("/projects", projectRouter);
routes.use("/storage", storageRouter);

export default routes;
