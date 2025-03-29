import express from "express";
import {
  registerUser,
  verifyCode,
  resendVerificationCode,
  loginUser,
  getUserProfile,
  getUserProfileById,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRegisterData } from "../middlewares/validateRegisterData.js";
import { adminOrSelfMiddleware } from "../middlewares/adminOrSelfMiddleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     description: Permite registrar un usuario con validaciones de email y DNI.
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
 *                 example: "juan@u-tad.com"
 *               password:
 *                 type: string
 *                 example: "SecureP@ss123"
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
userRouter.post("/register", validateRegisterData, registerUser);

/**
 * @swagger
 * /api/users/verify-code:
 *   post:
 *     summary: Verificar código de autenticación
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@u-tad.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Código correcto, usuario verificado.
 *       400:
 *         description: Código incorrecto o intentos agotados.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.post("/verify-code", verifyCode);

/**
 * @swagger
 * /api/users/resend-verification:
 *   post:
 *     summary: Reenviar el código de verificación
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@u-tad.com"
 *     responses:
 *       200:
 *         description: Código reenviado exitosamente.
 *       400:
 *         description: Ya verificado o espera antes de reenviar.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.post("/resend-verification", resendVerificationCode);

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
 *                 example: "juan@u-tad.com"
 *               password:
 *                 type: string
 *                 example: "SecureP@ss123"
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve token y datos del usuario.
 *       400:
 *         description: Datos incompletos.
 *       401:
 *         description: Credenciales inválidas o usuario eliminado.
 *       403:
 *         description: Usuario no verificado.
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *       401:
 *         description: No autorizado.
 */
userRouter.get("/", authMiddleware, getAllUsers);

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
 *         description: Perfil del usuario autenticado.
 *       401:
 *         description: Token no válido o no proporcionado.
 */
userRouter.get("/profile", authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Obtener perfil público de un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil público del usuario.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.get("/profile/:id", getUserProfileById);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualizar datos de usuario
 *     tags: [Usuarios]
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
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               grade:
 *                 type: string
 *                 enum: [INSO, MAIS, FIIS, DIPI, ANIV]
 *               rol:
 *                 type: string
 *                 enum: [admin, moderator, user]
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado.
 *       400:
 *         description: Datos no válidos o intento de modificar email/password.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.patch("/:id", authMiddleware, adminOrSelfMiddleware, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario (soft delete)
 *     tags: [Usuarios]
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
 *         description: Usuario marcado como eliminado.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.delete("/:id", authMiddleware, adminOrSelfMiddleware, deleteUser);

export default userRouter;
