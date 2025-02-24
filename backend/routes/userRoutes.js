import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  deleteUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, email, password, dni, grade]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan"
 *               surname:
 *                 type: string
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               dni:
 *                 type: string
 *                 example: "12345678A"
 *               grade:
 *                 type: string
 *                 enum: [INSO, MAIS, FIIS, DIPI, ANIV]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Algún campo es inválido o el correo ya está en uso.
 */
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el usuario y el token.
 *       400:
 *         description: Campos faltantes.
 *       401:
 *         description: Credenciales incorrectas.
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devuelve el perfil del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "65a3f2e4b1c3e5a7d2a4c9b2"
 *                 name:
 *                   type: string
 *                   example: "Juan"
 *                 surname:
 *                   type: string
 *                   example: "Pérez"
 *                 email:
 *                   type: string
 *                   example: "juan@example.com"
 *                 dni:
 *                   type: string
 *                   example: "12345678A"
 *                 grade:
 *                   type: string
 *                   example: "INSO"
 *                 rol:
 *                   type: string
 *                   example: "user"
 *       401:
 *         description: No autorizado, falta el token.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.get("/profile", authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (propio o por admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       403:
 *         description: No tienes permisos para eliminar este usuario.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
userRouter.delete("/:id", authMiddleware, deleteUser);

export default userRouter;
