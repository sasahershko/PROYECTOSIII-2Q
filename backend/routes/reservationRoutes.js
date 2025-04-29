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
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       500:
 *          description: Error en el servidor
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
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       403:
 *         description: No tienes los permisos necesarios
 *       500:
 *          description: Error en el servidor
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
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       500:
 *          description: Error en el servidor
 */
reservationRouter.get("/", authMiddleware, getUserReservations);

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
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       403:
 *         description: No tienes los permisos necesarios
 *       404:
 *         description: Reservas no encontrada
 *       500:
 *          description: Error en el servidor
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
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       403:
 *         description: No tienes los permisos necesarios
*       404:
 *         description: Reserva no encontrada
 *       500:
 *          description: Error en el servidor
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
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       403:
 *         description: No tienes los permisos necesarios
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *          description: Error en el servidor
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
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       403:
 *         description: No tienes los permisos necesarios
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *          description: Error en el servidor
 */
reservationRouter.delete("/:id", authMiddleware, deleteReservation);

export default reservationRouter;
