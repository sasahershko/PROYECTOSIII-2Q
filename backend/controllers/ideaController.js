import Idea from "../models/Idea.js";
import { handleHttpError } from "../utils/handleError.js";
import { logEvent } from "../utils/handleLogger.js";

// Obtener todas las ideas
export const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().populate("usuario", "name email");
    res.status(200).json(ideas);
  } catch (error) {
    handleHttpError(res, error);
  }
};

// Obtener una idea por ID
export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate(
      "usuario",
      "name email"
    );
    if (!idea) return handleHttpError(res, "Idea no encontrada", 404);
    res.status(200).json(idea);
  } catch (error) {
    handleHttpError(res, error);
  }
};

// Crear una nueva idea
export const createIdea = async (req, res) => {
  try {
    const { nombre, descripcion, usuario, grado } = req.body;
    const newIdea = new Idea({ nombre, descripcion, usuario, grado });
    await newIdea.save();

    await logEvent(`💡 Nueva idea creada por ${usuario}: ${nombre}`);

    res.status(201).json(newIdea);
  } catch (error) {
    handleHttpError(res, error);
  }
};

// Actualizar una idea
export const updateIdea = async (req, res) => {
  try {
    const { nombre, descripcion, usuario, grado } = req.body;
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, usuario, grado },
      { new: true }
    );
    if (!updatedIdea) return handleHttpError(res, "Idea no encontrada", 404);

    await logEvent(`✏️ Idea actualizada: ${updatedIdea.nombre} por ${usuario}`);

    res.status(200).json(updatedIdea);
  } catch (error) {
    handleHttpError(res, error);
  }
};

// Eliminar una idea
export const deleteIdea = async (req, res) => {
  try {
    const deletedIdea = await Idea.findByIdAndDelete(req.params.id);
    if (!deletedIdea) return handleHttpError(res, "Idea no encontrada", 404);

    await logEvent(`🗑️ Idea eliminada: ${deletedIdea.nombre}`);

    res.status(200).json({ message: "Idea eliminada correctamente" });
  } catch (error) {
    handleHttpError(res, error);
  }
};
