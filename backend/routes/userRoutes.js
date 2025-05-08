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
  hardDeleteUser,
  updateUser,
  getDeletedUsers,
  restoreUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOrSelfMiddleware } from "../middlewares/adminOrSelfMiddleware.js";
import {
  registerUserValidator,
  loginUserValidator,
  verifyCodeValidator,
  resendVerificationValidator,
  updateUserValidator,
  userIdValidator,
} from "../validators/userValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
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
userRouter.post(
  "/register",
  registerUserValidator,
  validateRequest,
  registerUser
);

/**
 * @swagger
 * /api/users/verify-code:
 *   post:
 *     summary: Verificar código de autenticación
 *     tags: [Users]
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
userRouter.post(
  "/verify-code",
  verifyCodeValidator,
  validateRequest,
  verifyCode
);

/**
 * @swagger
 * /api/users/resend-verification:
 *   post:
 *     summary: Reenviar el código de verificación
 *     tags: [Users]
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
userRouter.post(
  "/resend-verification",
  resendVerificationValidator,
  validateRequest,
  resendVerificationCode
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
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
userRouter.post("/login", loginUserValidator, validateRequest, loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
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
 * /api/users/deleted:
 *   get:
 *     summary: Obtener usuarios eliminados (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios eliminados.
 *       403:
 *         description: No autorizado.
 */
userRouter.get("/deleted", authMiddleware, getDeletedUsers);

/**
 * @swagger
 * /api/users/{id}/restore:
 *   put:
 *     summary: Restaurar un usuario eliminado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a restaurar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario restaurado correctamente.
 *       403:
 *         description: Solo los administradores pueden restaurar usuarios.
 *       500:
 *         description: Error al restaurar el usuario.
 */
userRouter.put(
  "/:id/restore",
  userIdValidator,
  validateRequest,
  authMiddleware,
  restoreUser
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [Users]
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
 *     tags: [Users]
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
 *     summary: Actualizar los datos de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: No puedes modificar el correo ni la contraseña.
 *       403:
 *         description: No tienes permiso para editar este usuario.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error del servidor.
 */
userRouter.patch(
  "/:id",
  userIdValidator,
  updateUserValidator,
  validateRequest,
  authMiddleware,
  adminOrSelfMiddleware,
  updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario marcado como eliminado (soft delete).
 *       403:
 *         description: No autorizado para eliminar este usuario.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al eliminar el usuario.
 */
userRouter.delete(
  "/:id",
  userIdValidator,
  validateRequest,
  authMiddleware,
  adminOrSelfMiddleware,
  deleteUser
);

/**
 * @swagger
 * /api/users/hard/{id}:
 *   delete:
 *     summary: Eliminar un usuario permanentemente (hard delete)
 *     tags: [Users]
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
 *         description: Usuario eliminado permanentemente y referencias limpiadas.
 *       403:
 *         description: Solo los administradores pueden realizar esta acción.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al eliminar el usuario.
 */
userRouter.delete(
  "/hard/:id",
  userIdValidator,
  validateRequest,
  authMiddleware,
  hardDeleteUser
);

export default userRouter;
