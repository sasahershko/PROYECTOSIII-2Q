import express from "express";
import {
    uploadMiddleware,
    uploadMiddlewareMemory,
} from "../utils/handle_storage.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createItem, updateImage, uploadAndUpdateUserImage } from "../controllers/storage.js";

const storageRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Storage
 *   description: Endpoints para la gestión de almacenamiento de imágenes
 */

/**
 * @swagger
 * /api/storage/local:
 *   post:
 *     summary: Subir imagen de manera local
 *     tags: [Storage]
 *     description: Permite subir una imagen al almacenamiento local del servidor.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida correctamente.
 *       400:
 *         description: Error en la subida de la imagen.
 *       401:
 *         description: No autorizado (falta token de autenticación).
 */
storageRouter.post("/local", authMiddleware ,uploadMiddleware.single("image"), createItem);

/**
 * @swagger
 * /api/storage:
 *   post:
 *     summary: Subir imagen a memoria
 *     tags: [Storage]
 *     description: Permite subir una imagen a la memoria del servidor.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida correctamente.
 *       400:
 *         description: Error en la subida de la imagen.
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       413:
 *         description: Error, archivo demasiado grande.
 */
storageRouter.post(
    "/", authMiddleware, 
    uploadMiddlewareMemory.single("image"),
    (err, req, res, next) => {
        console.log("ERROR:::::", err.code);
        res.status(413).send("Error capturado");
    },
    updateImage
);

/**
 * @swagger
 * /api/storage/{userId}:
 *   post:
 *     summary: Subir y actualizar imagen de perfil de usuario
 *     tags: [Storage]
 *     description: Permite subir y actualizar la imagen de perfil de un usuario.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario al que se le actualizará la imagen de perfil.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen de perfil actualizada correctamente.
 *       400:
 *         description: Error en la subida de la imagen.
 *       401:
 *         description: No autorizado (falta token de autenticación).
 *       404:
 *         description: Usuario no encontrado.
 */
storageRouter.post("/:userId", authMiddleware, uploadMiddlewareMemory.single("image"), uploadAndUpdateUserImage);


export default storageRouter;
