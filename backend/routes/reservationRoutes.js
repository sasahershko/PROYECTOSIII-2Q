import express from "express";
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  approveReservation,
  rejectReservation,
  deleteReservation
} from "../controllers/reservationController.js";


import {
  createTable
} from "../controllers/tablesController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
//import { verificarPermisoProyecto } from "../middlewares/projectAuthMiddleware.js";
import { validatorCreateReservation } from "../validators/reservationValidator.js";
import { validatorCreateTable } from "../validators/tablesValidator.js";
import { adminOrSelfMiddleware } from "../middlewares/adminOrSelfMiddleware.js";

const reservationRouter = express.Router();

// Crear una nueva reserva (solo usuarios autenticados)
reservationRouter.post("/", authMiddleware, validatorCreateReservation, createReservation);

reservationRouter.post("/table",validatorCreateTable, authMiddleware, adminOrSelfMiddleware ,createTable);

// Obtener reservas del usuario autenticado
reservationRouter.get("/", authMiddleware, getUserReservations);


//PENDIENTE DE TEST ⬇️⬇️⬇️ (con admin)

// Obtener todas las reservas (solo admin)
reservationRouter.get("/all", authMiddleware, adminOrSelfMiddleware, getAllReservations);


// Aprobar una reserva (solo admin)
reservationRouter.put("/:id/approve", authMiddleware, adminOrSelfMiddleware, approveReservation);


//Rechazar una reserva (solo admin)
reservationRouter.put("/:id/reject", authMiddleware, adminOrSelfMiddleware, rejectReservation);


//Borrar una reserva (admin o dueño de la reserva)
//DELETE /api/reservations/:id
//DELETE /api/reservations/:id?type=hard

reservationRouter.delete("/:id", authMiddleware, deleteReservation);


export default reservationRouter;
