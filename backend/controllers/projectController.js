import Project from "../models/Project.js";
import User from "../models/User.js";

// 🔁 Validar IDs de usuarios y devolver lista filtrada (sin duplicados ni inexistentes)
const filtrarUsuariosExistentes = async (ids = []) => {
  const usuarios = await User.find({ _id: { $in: ids }, isDeleted: false });
  return usuarios.map((u) => u._id.toString());
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      company,
      area,
      responsibles = [],
      users = [],
      benefit,
      folder,
      pStatus = [],
      pendingNotes = [],
      description,
      practicesAgreement = false,
      practicesStudents = 0,
      sdpStudents = 0,
      startDate,
      reviewDates = [],
      endDate,
    } = req.body;

    if (
      !name ||
      !contactPerson ||
      !company ||
      !area ||
      !description ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ mensaje: "Todos los campos obligatorios" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        mensaje: "La fecha de inicio no puede ser mayor que la de finalización",
      });
    }

    const responsablesValidos = await filtrarUsuariosExistentes(responsibles);
    const usuariosValidos = await filtrarUsuariosExistentes(users);
    const todosUsuarios = [
      ...new Set([...responsablesValidos, ...usuariosValidos]),
    ];

    const nuevoProyecto = await Project.create({
      name,
      contactPerson,
      company,
      area,
      responsibles: responsablesValidos,
      users: todosUsuarios,
      benefit,
      folder,
      pStatus,
      pendingNotes,
      description,
      practicesAgreement,
      practicesStudents,
      sdpStudents,
      startDate,
      reviewDates,
      endDate,
    });

    await User.updateMany(
      { _id: { $in: todosUsuarios } },
      { $addToSet: { projects: nuevoProyecto._id } }
    );

    res
      .status(201)
      .json({ mensaje: "Proyecto creado con éxito.", project: nuevoProyecto });
  } catch (error) {
    console.error("❌ Error al crear proyecto:", error);
    res.status(500).json({ mensaje: "Error al crear proyecto" });
  }
};

// Obtener todos los proyectos (no eliminados)
export const getAllProjects = async (req, res) => {
  try {
    let projects;

    if (!req.usuario) {
      projects = await Project.find({ isDeleted: false }).select(
        "area name description"
      );
    } else if (req.usuario.rol === "admin") {
      projects = await Project.find({ isDeleted: false });
    } else {
      projects = await Project.find({
        isDeleted: false,
        $or: [{ responsibles: req.usuario._id }, { users: req.usuario._id }],
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error al obtener proyectos:", error);
    res.status(500).json({ mensaje: "Error al obtener proyectos" });
  }
};

// Obtener proyecto por ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("responsibles", "name surname")
      .populate("users", "name surname")
      .populate("pendingNotes.userWhoWrites", "name surname")
      .populate("pendingNotes.userWhoReceives", "name surname");

    if (!project || project.isDeleted) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    res.json(project);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el proyecto", error: error.message });
  }
};

// Actualizar proyecto
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario } = req;

    const existingProject = await Project.findById(id);
    if (!existingProject || existingProject.isDeleted) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    if (
      usuario.rol !== "admin" &&
      !existingProject.responsibles.includes(usuario._id)
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para actualizar este proyecto." });
    }

    if (
      req.body.startDate &&
      req.body.endDate &&
      new Date(req.body.startDate) > new Date(req.body.endDate)
    ) {
      return res.status(400).json({
        mensaje:
          "La fecha de inicio no puede ser mayor que la de finalización.",
      });
    }

    if (req.body.responsibles) {
      const validResponsibles = await User.find({
        _id: { $in: req.body.responsibles },
      });
      if (validResponsibles.length !== req.body.responsibles.length) {
        return res
          .status(400)
          .json({ mensaje: "Alguno de los responsables no existen." });
      }
    }

    if (req.body.users) {
      const validUsers = await User.find({ _id: { $in: req.body.users } });
      if (validUsers.length !== req.body.users.length) {
        return res
          .status(400)
          .json({ mensaje: "Alguno de los usuarios no existen." });
      }
    }

    if (req.body.responsibles || req.body.users) {
      const uniqueUsers = [
        ...new Set([
          ...(req.body.responsibles || existingProject.responsibles),
          ...(req.body.users || existingProject.users),
        ]),
      ];
      req.body.users = uniqueUsers;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (req.body.users) {
      await User.updateMany({ projects: id }, { $pull: { projects: id } });
      await User.updateMany(
        { _id: { $in: req.body.users } },
        { $addToSet: { projects: id } }
      );
    }

    return res.status(200).json({
      mensaje: "Proyecto actualizado con éxito.",
      project: updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar el proyecto.",
      error: error.message,
    });
  }
};

/**
 * @desc Eliminar un proyecto y limpiar referencias en usuarios (soft delete)
 * @route DELETE /api/projects/:id
 * @access Private (solo admin o responsables del proyecto)
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioAutenticado = req.usuario;

    const proyecto = await Project.findById(id);
    if (!proyecto || proyecto.isDeleted) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    if (
      usuarioAutenticado.rol !== "admin" &&
      !proyecto.responsibles.includes(usuarioAutenticado._id)
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para eliminar este proyecto." });
    }

    await User.updateMany({ projects: id }, { $pull: { projects: id } });

    proyecto.isDeleted = true;
    await proyecto.save();

    res
      .status(200)
      .json({ mensaje: "Proyecto eliminado correctamente (soft delete)" });
  } catch (error) {
    console.error("❌ Error al eliminar proyecto:", error);
    res.status(500).json({ mensaje: "Error al eliminar proyecto" });
  }
};
