import Project from "../models/Project.js";
import User from "../models/User.js";
import { matchedData } from 'express-validator';
import {calculateBudget } from '../utils/budget.js'

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
      .populate("users", "name surname")
      .populate("pendingNotes.userWhoWrites", "name")
      .populate("pendingNotes.userWhoRecieves", "name");

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
    const hardDelete = req.query.hard === "true"; 

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

    if (hardDelete) {
      // 🔥 Hard delete
      await Project.findByIdAndDelete(id);
      await User.updateMany({ projects: id }, { $pull: { projects: id } });

      return res.status(200).json({
        mensaje: "Proyecto eliminado completamente (hard delete)",
      });
    } else {
      // 🗑️ Soft delete
      await proyecto.delete();
      return res.status(200).json({
        mensaje: "Proyecto eliminado correctamente (soft delete)",
      });
    }
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar proyecto",
      error: error.message,
    });
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


export const addNotes = async (req, res) => {
  try {
    const {
      note,
      userWhoRecieves = [],
      tag = "no completada"
    } = matchedData(req);

    const projectId = req.params.id;
    console.log(projectId);

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }


    //crear el objeto de la nota
    const noteObject = {
      note,
      userWhoWrites: req.usuario._id,
      userWhoRecieves,
      tag,
      date: Date.now(),
    };


    //agregar la nota
    project.pendingNotes.push(noteObject);
    await project.save();

    return res.status(200).send({ message: 'Nota agregada exitosamente' });

  } catch (error) {
    return res.status(500).send({ message: 'Error al agregar la nota', error: error.message });
  }
}

export const updateNote = async (req, res) => {
  try {
    const {
      noteIndex,
      note,
      userWhoWrites,
      userWhoRecieves,
      tag
    } = matchedData(req);

    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send({ message: 'Proyecto no encontrado' });
    }

    if (noteIndex < 0 || noteIndex >= project.pendingNotes.length) {
      return res.status(404).send({ message: 'Índice no válido.' });
    }

    const existingNote = project.pendingNotes[noteIndex];

    const updatedNote = {
      ...existingNote.toObject(),
      ...(note && { note }),
      ...(userWhoWrites && { userWhoWrites }),
      ...(userWhoRecieves && { userWhoRecieves }),
      ...(tag && { tag }),
      date: Date.now()
    };

    project.pendingNotes[noteIndex] = updatedNote;
    await project.save();

    return res.status(200).send({ message: 'Nota actualizada correctamente.' });

  } catch (error) {
    return res.status(500).send({ message: 'Error de servidor', error: error.message });
  }
};


export const deleteNote = async (req, res) => {
  try {
    const { noteIndex } = matchedData(req);
    console.log(noteIndex)
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (noteIndex < 0 || noteIndex >= project.pendingNotes.length) {
      return res.status(400).json({ message: 'Índice de nota no válido' });
    }
    console.log(' NOTA SELECCIONADA: ',project.pendingNotes[noteIndex].note);

    project.pendingNotes.splice(noteIndex, 1); 
    await project.save();

    return res.status(200).json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la nota', error: error.message });
  }
};


export const hardDeleteProject = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje:
          "Solo los administradores pueden eliminar proyectos permanentemente.",
      });
    }

    const { id } = req.filteredData;

    const proyecto = await Project.findOneWithDeleted({ _id: id });
    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado." });
    }

    // Eliminar referencia del proyecto en todos los usuarios
    await User.updateMany({ projects: id }, { $pull: { projects: id } });

    // Eliminar definitivamente el proyecto
    await Project.deleteOne({ _id: id });

    res
      .status(200)
      .json({ mensaje: "Proyecto eliminado permanentemente (hard delete)." });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar proyecto permanentemente",
      error: error.message,
    });
  }
};

export const updateProjectBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body.budget;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    if (!project.budget) {
      project.budget = {};
    }

    // fusionar valores enviados con los existentes
    const mergedBudget = {
      ...project.budget,
      ...updates,
      tutors: {
        ...project.budget.tutors,
        ...(updates.tutors || {})
      },
      interns: {
        ...project.budget.interns,
        ...(updates.interns || {})
      }
    };

    // eliminar cálculos anteriores
    delete mergedBudget.tutors?.subtotal;
    delete mergedBudget.interns?.subtotal;
    delete mergedBudget.totalGeneral;

    // calcular presupuesto actualizado
    calculateBudget(mergedBudget);

    // guardar nuevo presupuesto en el proyecto
    project.budget = mergedBudget;

    await project.save();

    return res.status(200).json({
      message: "Presupuesto actualizado correctamente",
      budget: project.budget
    });

  } catch (error) {
    console.error("Error al actualizar el presupuesto:", error);
    return res.status(500).json({
      message: "Error del servidor",
      error: error.message
    });
  }
};