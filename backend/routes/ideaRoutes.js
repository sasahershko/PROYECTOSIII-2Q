import express from "express";
import { getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea } from "../controllers/ideaController.js";

const router = express.Router();

router.get("/", getIdeas);
router.get("/:id", getIdeaById);
router.post("/", createIdea);
router.put("/:id", updateIdea);
router.delete("/:id", deleteIdea);

export default router; //Exportación compatible con `import` en `server.js`
