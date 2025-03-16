import Idea from "../models/Idea.js";

// Obtener todas las ideas
const getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find().populate('usuario', 'name email');
        res.status(200).json(ideas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ideas', error });
    }
};

// Obtener una idea por ID
const getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id).populate('usuario', 'name email');
        if (!idea) return res.status(404).json({ message: 'Idea no encontrada' });
        res.status(200).json(idea);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la idea', error });
    }
};

// Crear una nueva idea
const createIdea = async (req, res) => {
    try {
        const { nombre, descripcion, usuario, grado } = req.body;
        const newIdea = new Idea({ nombre, descripcion, usuario, grado });
        await newIdea.save();
        res.status(201).json(newIdea);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la idea', error });
    }
};

// Actualizar una idea
const updateIdea = async (req, res) => {
    try {
        const { nombre, descripcion, usuario, grado } = req.body;
        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, { nombre, descripcion, usuario, grado }, { new: true });
        if (!updatedIdea) return res.status(404).json({ message: 'Idea no encontrada' });
        res.status(200).json(updatedIdea);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la idea', error });
    }
};

// Eliminar una idea
const deleteIdea = async (req, res) => {
    try {
        const deletedIdea = await Idea.findByIdAndDelete(req.params.id);
        if (!deletedIdea) return res.status(404).json({ message: 'Idea no encontrada' });
        res.status(200).json({ message: 'Idea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la idea', error });
    }
};

// ✅ Exportamos las funciones correctamente en ES Modules
export {
    getIdeas,
    getIdeaById,
    createIdea,
    updateIdea,
    deleteIdea
};
