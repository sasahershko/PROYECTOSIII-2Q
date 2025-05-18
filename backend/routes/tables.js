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
 *             $ref: "#/components/schemas/Table"
 *     responses:
 *       201:
 *         description: Mesa creada
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
 *         description: Lista de mesas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Table"
 */
router.get("/", authMiddleware, getTables);

/**
 * @openapi
 * /api/tables/available:
 *   get:
 *     tags:
 *       - Tables
 *     summary: Obtener mesas disponibles por fecha y hora
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: time
 *         required: true
 *         schema:
 *           type: string
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
 *                 $ref: "#/components/schemas/Table"
 */
router.get("/available", authMiddleware, getAvailableTables);

export default router;
