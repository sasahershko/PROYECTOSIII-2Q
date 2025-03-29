import express from "express";
import {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";
import {
  authMiddleware,
  authMiddlewareOptional,
} from "../middlewares/authMiddleware.js";
import { verificarPermisoProyecto } from "../middlewares/projectAuthMiddleware.js";

const projectRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Endpoints para gestionar proyectos (solo proyectos no eliminados)
 */

/**
 * @swagger
 * /api/projects/create:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, contactPerson, company, area, description, startDate, endDate]
 *             properties:
 *               name:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               company:
 *                 type: string
 *                 enum: ["U-TAD", "ILION", "OTROS"]
 *               area:
 *                 type: string
 *               responsibles:
 *                 type: array
 *                 items:
 *                   type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *               benefit:
 *                 type: string
 *               folder:
 *                 type: string
 *               description:
 *                 type: string
 *               practicesAgreement:
 *                 type: boolean
 *               practicesStudents:
 *                 type: integer
 *               sdpStudents:
 *                 type: integer
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado con éxito.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error del servidor.
 */
projectRouter.post("/create", authMiddleware, createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos (no eliminados)
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida con éxito.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.get("/", authMiddlewareOptional, getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado con éxito.
 *       404:
 *         description: Proyecto no encontrado o eliminado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.get("/:id", authMiddlewareOptional, getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Proyecto actualizado con éxito.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No tienes permisos.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.put("/:id", authMiddleware, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto (soft delete)
 *     tags: [Proyectos]
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
 *         description: Proyecto marcado como eliminado.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.delete(
  "/:id",
  authMiddleware,
  verificarPermisoProyecto,
  deleteProject
);

export default projectRouter;
