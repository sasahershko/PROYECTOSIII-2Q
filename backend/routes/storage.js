import express from "express";
import {
    uploadMiddleware,
    uploadMiddlewareMemory,
} from "../utils/handle_storage.js";
import { createItem, updateImage } from "../controllers/storage.js";
import User from "../models/User.js";

const storageRouter = express.Router();

storageRouter.post("/local", uploadMiddleware.single("image"), createItem);
storageRouter.post(
    "/",
    uploadMiddlewareMemory.single("image"),
    (err, req, res, next) => {
        console.log("ERROR:::::", err.code);
        res.status(413).send("Error capturado");
    },
    updateImage
);

storageRouter.post(
    "/:userId",
    uploadMiddlewareMemory.single("image"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Debe subir una imagen" });
            }

            //EXTRAER PARAMETROS
            const { userId } = req.params;
            const fileBuffer = req.file.buffer;
            const fileName = req.file.originalname;
            
            

            //BUSCAR USUARIO ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            //SUBIR FOTO
            //const imageUrl = `/${req.file.filename}`;
            //const imageUrl = `http://localhost:${process.env.PORT}/storage/${req.file.filename}`;
            
            
            //const imageUrl = await updateImage(fileBuffer, fileName);
            const imgRes = await updateImage(req, res);
            const imageUrl = imgRes.ipfs;


            //UPDATE
            user.profileImage = imageUrl;
            await user.save();


            //RES SEND
            return res.status(200).json({
                message: "Imagen de perfil actualizada correctamente",
                profileImage: imageUrl,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
);

export default storageRouter;
