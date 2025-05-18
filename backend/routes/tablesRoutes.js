import express from "express";
import {
  createTable,
  getTables,
  getAvailableTables,
} from "../controllers/tablesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/roleMiddleware.js";
import { validatorCreateTable } from "../validators/tablesValidator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Endpoints para la gestión de tablas
 */

/**
 * @openapi
 * /api/tables:
 *   post:
 *     tags:
 *       - Tables
 *     summary: Crear una nueva mesa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TableCreate"
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TableResponse"
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validatorCreateTable,
  createTable
);

/**
 * @openapi
 * /api/tables:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Obtener todas las mesas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las mesas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TableResponse"
 *       403:
 *         description: No autorizado
 */
router.get("/", authMiddleware, getTables);

/**
 * @openapi
 * /api/tables/available:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Obtener mesas disponibles por fecha y hora
 *     description: Devuelve las mesas no reservadas para una fecha y franja horaria concretas.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-05-20"
 *       - in: query
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *         example: "10:00"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TableResponse"
 *       400:
 *         description: Parámetros inválidos
 *       403:
 *         description: No autorizado
 */
router.get("/available", authMiddleware, getAvailableTables);

export default router;
