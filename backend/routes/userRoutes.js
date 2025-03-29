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
 *     description: Verifica un código de autenticación enviado al correo del usuario.
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
 *     summary: Reenviar el código de verificación al correo del usuario
 *     tags: [Usuarios]
 *     description: Permite reenviar el código de verificación si el usuario aún no está verificado. Tiene un cooldown de 50 segundos entre cada reenvío.
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
 *         description: El usuario ya está verificado o hay que esperar antes de reenviar el código.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
userRouter.post("/resend-verification", resendVerificationCode);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     description: Autentica a un usuario y devuelve un token JWT.
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
 *         description: Login exitoso.
 *       400:
 *         description: Datos incorrectos.
 *       401:
 *         description: Credenciales inválidas.
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
 *                   example: "juan@u-tad.com"
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
 * /api/users/profile/{id}:
 *   get:
 *     summary: Obtener el perfil público de un usuario por ID
 *     tags: [Usuarios]
 *     description: Permite a cualquier usuario obtener información pública de otro usuario mediante su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se quiere consultar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del usuario.
 *                 nombre:
 *                   type: string
 *                   description: Nombre del usuario.
 *                 apellidos:
 *                   type: string
 *                   description: Apellidos del usuario.
 *                 foto:
 *                   type: string
 *                   description: URL de la foto de perfil.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
userRouter.get("/profile/:id", getUserProfileById);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualizar datos de un usuario
 *     tags: [Usuarios]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nuevo Nombre"
 *               surname:
 *                 type: string
 *                 example: "Nuevo Apellido"
 *               grade:
 *                 type: string
 *                 example: "INSO"
 *               profileImage:
 *                 type: string
 *                 example: "https://example.com/nueva-imagen.jpg"
 *     responses:
 *       200:
 *         description: Usuario actualizado.
 *       400:
 *         description: Intento de modificar email o contraseña bloqueado.
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
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado correctamente.
 *       403:
 *         description: No tienes permisos.
 *       404:
 *         description: Usuario no encontrado.
 */
userRouter.delete("/:id", authMiddleware, adminOrSelfMiddleware, deleteUser);

export default userRouter;
