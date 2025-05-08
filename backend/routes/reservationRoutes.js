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
 *             type: object
 *             required:
 *               - table
 *               - project
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               table:
 *                 type: string
 *                 description: ID de la mesa (MongoID)
 *                 example: "60f6e5e5d1e4f814c8fabc99"
 *               project:
 *                 type: string
 *                 description: ID del proyecto (MongoID)
 *                 example: "60f6e5e5d1e4f814c8fabc88"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               endTime:
 *                 type: string
 *                 example: "16:00"
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
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
 *             type: object
 *             required:
 *               - name
 *               - seats
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre identificativo de la mesa
 *                 example: "Mesa A1"
 *               seats:
 *                 type: number
 *                 description: Número de asientos disponibles
 *                 example: 6
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
reservationRouter.post(
  "/table",
  validatorCreateTable,
  authMiddleware,
  adminOrSelfMiddleware,
  createTable
);

/**
 * @openapi
 * /api/reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Obtener las reservas del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *       401:
 *         description: No autorizado
 */

reservationRouter.get("/", authMiddleware, getUserReservations);

/**
 * @openapi
 * /api/reservations/all:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Obtener todas las reservas (admin o responsable)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */

reservationRouter.get(
  "/all",
  authMiddleware,
  adminOrSelfMiddleware,
  getAllReservations
);

/**
 * @openapi
 * /api/reservations/{id}/approve:
 *   put:
 *     tags:
 *       - Reservations
 *     summary: Aprobar una reserva por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva aprobada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Reserva no encontrada
 */
reservationRouter.put(
  "/:id/approve",
  authMiddleware,
  adminOrSelfMiddleware,
  approveReservation
);

/**
 * @openapi
 * /api/reservations/{id}/reject:
 *   put:
 *     tags:
 *       - Reservations
 *     summary: Rechazar una reserva por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva rechazada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Reserva no encontrada
 */
reservationRouter.put(
  "/:id/reject",
  authMiddleware,
  adminOrSelfMiddleware,
  rejectReservation
);

/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Eliminar una reserva por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */
reservationRouter.delete("/:id", authMiddleware, deleteReservation);

export default reservationRouter;
