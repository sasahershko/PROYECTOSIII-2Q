import express from "express";
import {
  createReservation/*,
  getUserReservations,
  getAllReservations,
  approveReservation,
  deleteReservation,*/
} from "../controllers/reservationController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verificarPermisoProyecto } from "../middlewares/projectAuthMiddleware.js";
import { validatorCreateReservation } from "../utils/validators/reservationValidator.js";

const reservationRouter = express.Router();

// Crear una nueva reserva (solo usuarios autenticados)
reservationRouter.post("/", authMiddleware, validatorCreateReservation, createReservation);


/*

// Obtener reservas del usuario autenticado
reservationRouter.get("/user", authMiddleware, getUserReservations);

// Obtener todas las reservas (solo admin)
reservationRouter.get("/", authMiddleware, verificarPermisoProyecto, getAllReservations);

// Aprobar una reserva (solo admin)
reservationRouter.put("/:id/approve", authMiddleware, verificarPermisoProyecto, approveReservation);

// Cancelar una reserva (admin o dueño de la reserva)
reservationRouter.delete("/:id", authMiddleware, deleteReservation);

*/
export default reservationRouter;
