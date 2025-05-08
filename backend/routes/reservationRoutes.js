import express from "express";
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  approveReservation,
  rejectReservation,
  deleteReservation,
} from "../controllers/reservationController.js";

import { createTable } from "../controllers/tablesController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
//import { verificarPermisoProyecto } from "../middlewares/projectAuthMiddleware.js";
import { validatorCreateReservation } from "../validators/reservationValidator.js";
import { validatorCreateTable } from "../validators/tablesValidator.js";
import { adminOrSelfMiddleware } from "../middlewares/adminOrSelfMiddleware.js";

const reservationRouter = express.Router();

// Crear una nueva reserva (solo usuarios autenticados)
/**
 * @openapi
 * /api/reservations:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Crear una nueva reserva
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservations'
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Error en los datos enviados
 */
reservationRouter.post(
  "/",
  authMiddleware,
  validatorCreateReservation,
  createReservation
);

/**
 * @openapi
 * /api/reservations/table:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Crear una nueva mesa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *       400:
 *         description: Error en los datos enviados
 */
reservationRouter.post(
  "/table",
  validatorCreateTable,
  authMiddleware,
  adminOrSelfMiddleware,
  createTable
);

// Obtener reservas del usuario autenticado
/**
 * @openapi
 * /api/reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Obtener reservas del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
reservationRouter.get("/", authMiddleware, getUserReservations);

//PENDIENTE DE TEST ⬇️⬇️⬇️ (con admin)

// Obtener todas las reservas (solo admin)
/**
 * @openapi
 * /api/reservations/all:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Obtener todas las reservas (solo admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *       403:
 *         description: No autorizado
 */
reservationRouter.get(
  "/all",
  authMiddleware,
  adminOrSelfMiddleware,
  getAllReservations
);

// Aprobar una reserva (solo admin)
/**
 * @openapi
 * /api/reservations/{id}/approve:
 *   put:
 *     tags:
 *       - Reservations
 *     summary: Aprobar una reserva
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva aprobada
 *       403:
 *         description: No autorizado
 */
reservationRouter.put(
  "/:id/approve",
  authMiddleware,
  adminOrSelfMiddleware,
  approveReservation
);

//Rechazar una reserva (solo admin)
/**
 * @openapi
 * /api/reservations/{id}/reject:
 *   put:
 *     tags:
 *       - Reservations
 *     summary: Rechazar una reserva
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva rechazada
 *       403:
 *         description: No autorizado
 */
reservationRouter.put(
  "/:id/reject",
  authMiddleware,
  adminOrSelfMiddleware,
  rejectReservation
);

//Borrar una reserva (admin o dueño de la reserva)
//DELETE /api/reservations/:id
//DELETE /api/reservations/:id?type=hard
/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Eliminar una reserva
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [soft, hard]
 *     responses:
 *       200:
 *         description: Reserva eliminada
 *       403:
 *         description: No autorizado
 */
reservationRouter.delete("/:id", authMiddleware, deleteReservation);

export default reservationRouter;
