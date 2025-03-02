import express from "express";
import { uploadMiddleware, uploadMiddlewareMemory } from "../utils/handle_storage.js";
import { createItem, updateImage } from "../controllers/storage.js";

const storageRouter = express.Router();

storageRouter.post("/local", uploadMiddleware.single("image"), createItem);
storageRouter.post("/", uploadMiddlewareMemory.single("image"), (err, req, res, next) => {
    console.log("ERROR:::::", err.code);
    res.status(413).send('Error capturado');
});

export default storageRouter;
