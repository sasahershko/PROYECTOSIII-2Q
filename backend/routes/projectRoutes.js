import express from "express";
import {
  createProject,
  getProjectById,
  getAllProjects,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";
import { authMiddleware, authMiddlewareOptional } from "../middleware/authMiddleware.js";
import { verificarPermisoProyecto } from "../middleware/projectAuthMiddleware.js";

const projectRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Endpoints para gestionar proyectos
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "67bc57737e86e4b15d13830b"
 *                   name:
 *                     type: string
 *                     example: "Proyecto de prueba"
 *                   contactPerson:
 *                     type: string
 *                     example: "Ejemplo contacto"
 *                   company:
 *                     type: string
 *                     example: "U-TAD"
 *                   area:
 *                     type: string
 *                     example: "Ingeniería del SW"
 *                   responsibles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["67b62dd740c49029ad73d9eb"]
 *                   users:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["67b6730a953a36e3b39ab73c"]
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-02-24"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-06-30"
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.get("/", authMiddlewareOptional, getAllProjects);

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
 *                 example: "Nuevo Proyecto"
 *               contactPerson:
 *                 type: string
 *                 example: "María López"
 *               company:
 *                 type: string
 *                 enum: ["U-TAD", "ILION", "OTROS"]
 *                 example: "U-TAD"
 *               area:
 *                 type: string
 *                 example: "Desarrollo Web"
 *               responsibles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["67b62dd740c49029ad73d9eb"]
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["67b6730a953a36e3b39ab73c"]
 *               benefit:
 *                 type: string
 *                 example: "Incremento de productividad"
 *               projectFolder:
 *                 type: string
 *                 example: "/projects/proyecto1"
 *               description:
 *                 type: string
 *                 example: "Este es un proyecto de desarrollo web."
 *               practicesAgreement:
 *                 type: boolean
 *                 example: false
 *               practicesStudents:
 *                 type: integer
 *                 example: 2
 *               sdpStudents:
 *                 type: integer
 *                 example: 3
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-24"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-30"
 *     responses:
 *       201:
 *         description: Proyecto creado con éxito.
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes.
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.post("/create", authMiddleware, createProject);

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
 *         description: ID del proyecto a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto encontrado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "67bc57737e86e4b15d13830b"
 *                 name:
 *                   type: string
 *                   example: "Proyecto de prueba"
 *                 contactPerson:
 *                   type: string
 *                   example: "Ejemplo contacto"
 *                 company:
 *                   type: string
 *                   example: "U-TAD"
 *                 area:
 *                   type: string
 *                   example: "Ingeniería del SW"
 *                 responsibles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["67b62dd740c49029ad73d9eb"]
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["67b6730a953a36e3b39ab73c"]
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-02-24"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-06-30"
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
projectRouter.get("/:id", getProjectById);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     description: Permite a un administrador o a un responsable del proyecto eliminarlo. También se eliminan las referencias del proyecto en los usuarios asociados.
 *     tags:
 *       - Proyectos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto a eliminar
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente y referencias en usuarios limpiadas.
 *       403:
 *         description: No tienes permisos para eliminar este proyecto.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
projectRouter.delete("/:id", verificarPermisoProyecto, deleteProject);


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
 *                 example: "Proyecto actualizado"
 *               contactPerson:
 *                 type: string
 *                 example: "Juan Pérez"
 *               company:
 *                 type: string
 *                 enum: ["U-TAD", "ILION", "OTROS"]
 *                 example: "ILION"
 *               area:
 *                 type: string
 *                 example: "Inteligencia Artificial"
 *               responsibles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["67b62dd740c49029ad73d9eb"]
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["67b6730a953a36e3b39ab73c"]
 *               benefit:
 *                 type: string
 *                 example: "Automatización de procesos"
 *               projectFolder:
 *                 type: string
 *                 example: "/projects/proyecto_actualizado"
 *               description:
 *                 type: string
 *                 example: "Actualización de características del proyecto."
 *               practicesAgreement:
 *                 type: boolean
 *                 example: true
 *               practicesStudents:
 *                 type: integer
 *                 example: 5
 *               sdpStudents:
 *                 type: integer
 *                 example: 4
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-15"
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
projectRouter.put("/:id", authMiddleware, updateProject);

export default projectRouter;