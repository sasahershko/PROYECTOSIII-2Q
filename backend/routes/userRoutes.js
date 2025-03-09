import express from "express";
import {
  registerUser,
  verifyCode, //Nueva función para verificar código
  loginUser,
  getUserProfile,
  getUserProfileById,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/userController.js";
import {
  authMiddleware,
  adminMiddleware,
  moderatorMiddleware,
} from "../middleware/authMiddleware.js";

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
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/users/verify-code:
 *   post:
 *     summary: Verificar el código de autenticación
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
 *       500:
 *         description: Error en el servidor.
 */
userRouter.post("/verify-code", verifyCode);

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
 *         description: Login exitoso, devuelve el usuario y el token.
 *       400:
 *         description: Campos faltantes.
 *       401:
 *         description: Credenciales incorrectas.
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
 *         description: Lista de todos los usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "65a3f2e4b1c3e5a7d2a4c9b2"
 *                   name:
 *                     type: string
 *                     example: "Juan"
 *                   surname:
 *                     type: string
 *                     example: "Pérez"
 *                   email:
 *                     type: string
 *                     example: "juan@u-tad.com"
 *                   dni:
 *                     type: string
 *                     example: "12345678A"
 *                   grade:
 *                     type: string
 *                     example: "INSO"
 *                   rol:
 *                     type: string
 *                     example: "user"
 *       401:
 *         description: No autorizado, falta el token.
 *       500:
 *         description: Error en el servidor.
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
 *   delete:
 *     summary: Eliminar usuario (propio o admin) y limpiar referencias en proyectos
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar (puede ser el propio usuario o un admin eliminando cualquier cuenta)
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

/**
 * @swagger
 * /api/users/update-role/{id}:
 *   put:
 *     summary: Actualizar el rol de un usuario (requiere ser admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario cuyo rol se actualizará
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rol]
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [admin, moderator, user]
 *                 example: "moderator"
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente.
 *       400:
 *         description: Rol no válido.
 *       403:
 *         description: No tienes permisos para actualizar el rol.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
userRouter.put(
  "/update-role/:id",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

export default userRouter;
