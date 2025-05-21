import express from "express";
import {
  getIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
} from "../controllers/ideaController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ideas
 *   description: Endpoints para gestionar ideas de proyectos
 */

/**
 * @swagger
 * /api/ideas:
 *   get:
 *     summary: Obtener todas las ideas
 *     tags: [Ideas]
 *     responses:
 *       200:
 *         description: Lista de ideas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IdeaResponse'
 *       500:
 *         description: Error del servidor
 */
router.get("/", getIdeas);

/**
 * @swagger
 * /api/ideas/{id}:
 *   get:
 *     summary: Obtener una idea por ID
 *     tags: [Ideas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la idea
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IdeaResponse'
 *       404:
 *         description: Idea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", getIdeaById);

/**
 * @swagger
 * /api/ideas:
 *   post:
 *     summary: Crear una nueva idea
 *     tags: [Ideas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdeaCreate'
 *     responses:
 *       201:
 *         description: Idea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IdeaResponse'
 *       500:
 *         description: Error del servidor
 */
router.post("/", createIdea);

/**
 * @swagger
 * /api/ideas/{id}:
 *   put:
 *     summary: Actualizar una idea por ID
 *     tags: [Ideas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la idea a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IdeaUpdate'
 *     responses:
 *       200:
 *         description: Idea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IdeaResponse'
 *       404:
 *         description: Idea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", updateIdea);

/**
 * @swagger
 * /api/ideas/{id}:
 *   delete:
 *     summary: Eliminar una idea por ID
 *     tags: [Ideas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la idea a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Idea eliminada exitosamente
 *       404:
 *         description: Idea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", deleteIdea);

export default router;
