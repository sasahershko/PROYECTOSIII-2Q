import express from "express";
import userRouter from "./userRoutes.js";
import projectRouter from "./projectRoutes.js";
import storageRouter from "./storageRoutes.js";
import ideaRoutes from "./ideaRoutes.js";
import reservationRouter from "./reservationRoutes.js";
import tablesRouter from "./tablesRoutes.js";

const routes = express.Router();

// Registrar todas las rutas aquí
routes.use("/users", userRouter);
routes.use("/projects", projectRouter);
routes.use("/storage", storageRouter);
routes.use("/ideas", ideaRoutes);
routes.use("/reservations", reservationRouter);
routes.use("/tables", tablesRouter);

export default routes;
