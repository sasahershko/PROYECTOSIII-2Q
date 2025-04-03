import Project from "../models/Project.js";

/**
 * @desc Middleware para verificar si el usuario es admin o responsable del proyecto
 */
export const verificarPermisoProyecto = async (req, res, next) => {
  try {
    const usuarioAutenticado = req.usuario; // Usuario que hace la petición
    const { id } = req.params; // ID del proyecto a verificar

    const proyecto = await Project.findById(id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    // Verificar si es admin o responsable del proyecto
    if (
      usuarioAutenticado.rol !== "admin" &&
      !proyecto.responsibles.includes(usuarioAutenticado._id)
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para modificar este proyecto." });
    }

    // Si tiene permisos, continuar con la siguiente función
    next();
  } catch (error) {
    console.error("❌ Error en permisos de proyecto:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};
