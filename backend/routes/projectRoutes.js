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
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *       403:
 *         description: Solo los administradores pueden ver proyectos eliminados.
 *       500:
 *         description: Error al obtener los proyectos eliminados.
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
 *     tags: [Projects]
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
 * /api/projects/note/{id}:
 *   post:
 *     summary: Agregar una nueva nota a un proyecto.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               note:
 *                 type: string
 *                 description: Contenido de la nota.
 *                 example: "Esta es una nueva nota."
 *               userWhoWrites:
 *                 type: string
 *                 description: ID del usuario que escribe la nota.
 *                 example: "606d1f2c2f1b2c3a4d5e6f8h"
 *               userWhoRecieves:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de IDs de usuarios que recibirán la nota.
 *                 example: ["606d1f2c2f1b2c3a4d5e6f9i"]
 *               tag:
 *                 type: string
 *                 enum: ["completada", "no completada"]
 *                 description: Estado de la nota.
 *                 example: "no completada"
 *     responses:
 *       200:
 *         description: Nota agregada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nota agregada exitosamente"
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
 *     summary: Actualizar una nota existente en un proyecto.
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto al que pertenece la nota.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - noteIndex
 *             properties:
 *               noteIndex:
 *                 type: integer
 *                 description: Índice de la nota dentro del arreglo pendingNotes del proyecto.
 *                 example: 0
 *               note:
 *                 type: string
 *                 description: Contenido actualizado de la nota.
 *                 example: "Nota actualizada."
 *               userWhoWrites:
 *                 type: string
 *                 description: ID del usuario que actualiza la nota.
 *                 example: "606d1f2c2f1b2c3a4d5e6f8h"
 *               userWhoRecieves:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de IDs de usuarios que recibirán la nota actualizada.
 *                 example: ["606d1f2c2f1b2c3a4d5e6f9i"]
 *               tag:
 *                 type: string
 *                 enum: ["completada", "no completada"]
 *                 description: Estado actualizado de la nota.
 *                 example: "completada"
 *     responses:
 *       200:
 *         description: Nota actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nota actualizada correctamente."
 *       400:
 *         description: Índice no válido o datos incorrectos.
 *       404:
 *         description: Proyecto o nota no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.patch(
  "/note/:id",
  authMiddleware,
  updateNoteValidator,
  updateNote
);

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
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Presupuesto inicial"
 *                   reason:
 *                     type: string
 *                     example: "Proyecto de colaboración con empresa externa"
 *                   generalComments:
 *                     type: string
 *                     example: "Versión preliminar"
 *                   tutors:
 *                     type: object
 *                     properties:
 *                       numTutors:
 *                         type: number
 *                         example: 2
 *                       estimatedHours:
 *                         type: number
 *                         example: 10
 *                       pricePerHour:
 *                         type: number
 *                         example: 25
 *                   interns:
 *                     type: object
 *                     properties:
 *                       numInterns:
 *                         type: number
 *                         example: 1
 *                       estimatedHours:
 *                         type: number
 *                         example: 80
 *                       pricePerHour:
 *                         type: number
 *                         example: 12
 *                   extraExpenses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         description:
 *                           type: string
 *                           example: "Licencia software"
 *                         quantity:
 *                           type: number
 *                           example: 3
 *                         unitPrice:
 *                           type: number
 *                           example: 50
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
 *                   $ref: '#/components/schemas/Budget'
 *       400:
 *         description: Datos inválidos.
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

export default projectRouter;
