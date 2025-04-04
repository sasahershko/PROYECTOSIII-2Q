import express from "express";
import {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
  getDeletedProjects,
  restoreProject,
  hardDeleteProject,
} from "../controllers/projectController.js";
import {
  authMiddleware,
  authMiddlewareOptional,
} from "../middlewares/authMiddleware.js";
import { verificarPermisoProyecto } from "../middlewares/projectAuthMiddleware.js";
import {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
} from "../validators/projectValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

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
 *             required:
 *               - name
 *               - contactPerson
 *               - company
 *               - area
 *               - description
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Plataforma Gestión Académica"
 *               contactPerson:
 *                 type: string
 *                 example: "Juan Pérez"
 *               company:
 *                 type: string
 *                 enum: ["U-TAD", "ILION", "OTROS"]
 *                 example: "U-TAD"
 *               area:
 *                 type: string
 *                 enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV", "DIDI"]
 *                 example: "INSO"
 *               responsibles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["660e3c8a4f3caa23e483bdf1"]
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["660e3c8a4f3caa23e483bdf2"]
 *               benefit:
 *                 type: string
 *                 example: "Facilita la gestión centralizada"
 *               folder:
 *                 type: string
 *                 example: "/ruta/a/la/carpeta"
 *               description:
 *                 type: string
 *                 example: "Este proyecto busca unificar herramientas académicas."
 *               practicesAgreement:
 *                 type: boolean
 *                 example: true
 *               practicesStudents:
 *                 type: integer
 *                 example: 3
 *               sdpStudents:
 *                 type: integer
 *                 example: 2
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               reviewDates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                 example: ["2025-04-15", "2025-05-10"]
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *     responses:
 *       201:
 *         description: Proyecto creado con éxito.
 *       400:
 *         description: Validaciones fallidas o datos incorrectos.
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.post(
  "/create",
  authMiddleware,
  createProjectValidator,
  validateRequest,
  createProject
);

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Endpoints para gestionar proyectos (solo proyectos no eliminados)
 */

projectRouter.get("/", authMiddlewareOptional, getAllProjects);

/**
 * @swagger
 * /api/projects/deleted:
 *   get:
 *     summary: Obtener todos los proyectos eliminados (soft delete)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos eliminados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       403:
 *         description: Solo los administradores pueden ver proyectos eliminados.
 *       500:
 *         description: Error al obtener los proyectos eliminados.
 */
projectRouter.get("/deleted", authMiddleware, getDeletedProjects);

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
projectRouter.get(
  "/:id",
  projectIdValidator,
  validateRequest,
  authMiddlewareOptional,
  getProjectById
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               company:
 *                 type: string
 *                 enum: [U-TAD, ILION, OTROS]
 *               area:
 *                 type: string
 *                 enum: [INSO, MAIS, FIIS, DIPI, ANIV, DIDI]
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
 *                 minimum: 0
 *               sdpStudents:
 *                 type: integer
 *                 minimum: 0
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Proyecto actualizado con éxito.
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes.
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       403:
 *         description: No tienes permisos para actualizar este proyecto.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.put(
  "/:id",
  authMiddleware,
  projectIdValidator,
  updateProjectValidator,
  validateRequest,
  updateProject
);

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
  projectIdValidator,
  validateRequest,
  verificarPermisoProyecto,
  deleteProject
);

/**
 * @swagger
 * /api/projects/hard/{id}:
 *   delete:
 *     summary: Eliminar un proyecto permanentemente (hard delete)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado permanentemente y referencias limpiadas.
 *       403:
 *         description: Solo los administradores pueden realizar esta acción.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error al eliminar el proyecto.
 */
projectRouter.delete(
  "/hard/:id",
  projectIdValidator,
  validateRequest,
  authMiddleware,
  hardDeleteProject
);

/**
 * @swagger
 * /api/projects/{id}/restore:
 *   put:
 *     summary: Restaurar un proyecto eliminado (soft delete)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a restaurar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto restaurado correctamente.
 *       403:
 *         description: Solo los administradores pueden realizar esta acción.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error al restaurar el proyecto.
 */
projectRouter.put(
  "/:id/restore",
  authMiddleware,
  projectIdValidator,
  validateRequest,
  restoreProject
);

export default projectRouter;
