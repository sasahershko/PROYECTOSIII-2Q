import express from "express";
import {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
  getDeletedProjects,
  restoreProject,
  addNotes,
  updateNote,
  deleteNote,
  hardDeleteProject,
  updateProjectBudget,
  addUsersToProject,
  removeUsersFromProject,
  addIncomeToProject,
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
  budgetValidator,
  validateProjectUsersUpdate,
  validatorAddIncome,
} from "../validators/projectValidator.js";
import {
  createNoteValidator,
  updateNoteValidator,
  deleteNoteValidator,
} from "../validators/noteValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const projectRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Endpoints para gestionar proyectos (solo proyectos no eliminados)
 */

/**
 * @swagger
 * /api/projects/create:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProjectCreate"
 *     responses:
 *       201:
 *         description: Proyecto creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProjectResponse"
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
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ProjectResponse"
 *       403:
 *         description: No autorizado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.get("/", authMiddlewareOptional, getAllProjects);

/**
 * @swagger
 * /api/projects/deleted:
 *   get:
 *     summary: Obtener todos los proyectos eliminados (soft delete)
 *     tags: [Projects]
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
 *                 $ref: '#/components/schemas/Projects'
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
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProjectResponse"
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
 *   patch:
 *     summary: Actualizar un proyecto existente
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProjectUpdate"
 *     responses:
 *       200:
 *         description: Proyecto actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProjectResponse"
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: No tienes permisos para actualizar este proyecto.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.patch(
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
 *     summary: Eliminar un proyecto (soft o hard delete)
 *     description: Elimina un proyecto. Por defecto realiza un soft delete. Para eliminar permanentemente (hard delete), añadir el parámetro de consulta `?hard=true`.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto a eliminar.
 *         schema:
 *           type: string
 *       - in: query
 *         name: hard
 *         required: false
 *         description: Si se establece como `true`, se realiza un hard delete.
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente.
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
 *     tags: [Projects]
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
 *     tags: [Projects]
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

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Endpoints para la gestión de notas de proyectos
 */

/**
 * @swagger
 * /api/projects/note/{id}:
 *   post:
 *     summary: Agregar una nueva nota a un proyecto
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto al que se le añadirá la nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProjectNote"
 *     responses:
 *       200:
 *         description: Nota agregada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProjectNote"
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.post("/note/:id", authMiddleware, createNoteValidator, addNotes);

/**
 * @swagger
 * /api/projects/note/{id}:
 *   patch:
 *     summary: Actualizar una nota existente en un proyecto
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 required: [noteIndex]
 *                 properties:
 *                   noteIndex:
 *                     type: integer
 *                     example: 0
 *               - $ref: "#/components/schemas/ProjectNote"
 *     responses:
 *       200:
 *         description: Nota actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Proyecto o nota no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.patch(
  "/note/:id",
  authMiddleware,
  updateNoteValidator,
  updateNote
);

/**
 * @swagger
 * /api/projects/note/{id}:
 *   delete:
 *     summary: Eliminar una nota específica de un proyecto
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [noteIndex]
 *             properties:
 *               noteIndex:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Nota eliminada correctamente
 *       400:
 *         description: Índice inválido
 *       404:
 *         description: Proyecto o nota no encontrada
 *       500:
 *         description: Error interno del servidor
 */
projectRouter.delete(
  "/note/:id",
  authMiddleware,
  deleteNoteValidator,
  deleteNote
);

/**
 * @swagger
 * /api/projects/budget/{id}:
 *   patch:
 *     summary: Actualizar el presupuesto de un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto al que se le actualizará el presupuesto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget:
 *                 $ref: '#/components/schemas/ProjectBudget'
 *     responses:
 *       200:
 *         description: Presupuesto actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Presupuesto actualizado correctamente"
 *                 budget:
 *                   $ref: '#/components/schemas/ProjectBudget'
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Token no válido o no proporcionado.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.patch(
  "/budget/:id",
  authMiddleware,
  budgetValidator,
  updateProjectBudget
);

/**
 * @swagger
 * /api/proyectos/{id}/add-users:
 *   patch:
 *     summary: Añadir participantes y/o responsables a un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto al que añadir usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de usuarios a añadir como participantes
 *               responsibles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de usuarios a añadir como responsables
 *     responses:
 *       200:
 *         description: Usuarios añadidos correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token no válido o no proporcionado.
 *       403:
 *         description: No tienes permiso para modificar este proyecto
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error del servidor
 */
projectRouter.patch(
  "/:id/add-users",
  authMiddleware,
  verificarPermisoProyecto,
  validateProjectUsersUpdate,
  validateRequest,
  addUsersToProject
);

/**
 * @swagger
 * /api/proyectos/{id}/remove-users:
 *   patch:
 *     summary: Eliminar participantes y/o responsables de un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto al que eliminar usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de usuarios a eliminar como participantes
 *               responsibles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de usuarios a eliminar como responsables
 *     responses:
 *       200:
 *         description: Usuarios eliminados correctamente
 *       401:
 *         description: Token no válido o no proporcionado.
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No tienes permiso para modificar este proyecto
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error del servidor
 */
projectRouter.patch(
  "/:id/remove-users",
  authMiddleware,
  verificarPermisoProyecto,
  validateProjectUsersUpdate,
  validateRequest,
  removeUsersFromProject
);

/**
 * @swagger
 * /api/projects/{id}/budget/incomes:
 *   patch:
 *     summary: Añadir un ingreso al presupuesto del proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concept
 *               - amount
 *             properties:
 *               concept:
 *                 type: string
 *                 example: "Pago por cliente"
 *               amount:
 *                 type: number
 *                 example: 5000
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-18"
 *     responses:
 *       200:
 *         description: Ingreso añadido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ingreso añadido correctamente.
 *                 budget:
 *                   $ref: '#/components/schemas/ProjectBudget'
 *       400:
 *         description: Validaciones fallidas
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
projectRouter.patch(
  "/:id/budget/incomes",
  authMiddleware,
  validatorAddIncome,
  addIncomeToProject
);

export default projectRouter;
