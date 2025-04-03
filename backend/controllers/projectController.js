import Project from "../models/Project.js";
import User from "../models/User.js";

// 🔁 Validar IDs de usuarios y devolver lista filtrada (sin duplicados ni inexistentes)
const filtrarUsuariosExistentes = async (ids = []) => {
  const usuarios = await User.find({ _id: { $in: ids } });
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
    } = req.filteredData;

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

    res.status(201).json({
      mensaje: "Proyecto creado con éxito.",
      project: nuevoProyecto,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear proyecto",
      error: error.message,
    });
  }
};

// Obtener todos los proyectos (no eliminados)
export const getAllProjects = async (req, res) => {
  try {
    let projects;
    if (!req.usuario) {
      projects = await Project.find().select("area name description");
    } else if (req.usuario.rol === "admin") {
      projects = await Project.find();
    } else {
      projects = await Project.find({
        $or: [{ responsibles: req.usuario._id }, { users: req.usuario._id }],
      });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los proyectos",
      error: error.message,
    });
  }
};

// Obtener proyecto por ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.filteredData;
    const project = await Project.findById(id)
      .populate("responsibles", "name")
      .populate("users", "name")
      .populate("pendingNotes.userWhoWrites", "name")
      .populate("pendingNotes.userWhoReceives", "name");

    if (!project)
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
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
    const { id } = req.filteredData;
    const { usuario } = req;
    const data = req.filteredData;

    const existingProject = await Project.findById(id);
    if (!existingProject) {
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

    // Validación: fechas coherentes
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    ) {
      return res.status(400).json({
        mensaje:
          "La fecha de inicio no puede ser mayor que la de finalización.",
      });
    }

    // Validación de usuarios y responsables
    if (data.responsibles) {
      const validResponsibles = await User.find({
        _id: { $in: data.responsibles },
      });
      if (validResponsibles.length !== data.responsibles.length) {
        return res
          .status(400)
          .json({ mensaje: "Alguno de los responsables no existen." });
      }
    }

    if (data.users) {
      const validUsers = await User.find({ _id: { $in: data.users } });
      if (validUsers.length !== data.users.length) {
        return res
          .status(400)
          .json({ mensaje: "Alguno de los usuarios no existen." });
      }
    }

    // Fusionar usuarios y responsables si están presentes
    if (data.responsibles || data.users) {
      const uniqueUsers = [
        ...new Set([
          ...(data.responsibles || existingProject.responsibles),
          ...(data.users || existingProject.users),
        ]),
      ];
      data.users = uniqueUsers;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (data.users) {
      await User.updateMany({ projects: id }, { $pull: { projects: id } });
      await User.updateMany(
        { _id: { $in: data.users } },
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
    const { id } = req.filteredData;
    const usuario = req.usuario;

    const proyecto = await Project.findById(id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    if (
      usuario.rol !== "admin" &&
      !proyecto.responsibles.includes(usuario._id)
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para eliminar este proyecto." });
    }

    await User.updateMany({ projects: id }, { $pull: { projects: id } });
    await proyecto.delete();

    res
      .status(200)
      .json({ mensaje: "Proyecto eliminado correctamente (soft delete)" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar proyecto", error: error.message });
  }
};

export const getDeletedProjects = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje: "Solo los administradores pueden ver proyectos eliminados.",
      });
    }

    const deleted = await Project.findDeleted()
      .populate("responsibles", "name")
      .populate("users", "name");
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener proyectos eliminados",
      error: error.message,
    });
  }
};

export const restoreProject = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje: "Solo los administradores pueden restaurar proyectos.",
      });
    }

    const { id } = req.filteredData;
    await Project.restore({ _id: id });

    const restoredProject = await Project.findById(id);
    await User.updateMany(
      { _id: { $in: restoredProject.users } },
      { $addToSet: { projects: restoredProject._id } }
    );

    res.status(200).json({
      mensaje: "Proyecto restaurado correctamente.",
      restored: restoredProject,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al restaurar proyecto",
      error: error.message,
    });
  }
};
