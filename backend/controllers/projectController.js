import Project from "../models/Project.js";
import User from "../models/User.js";
import { matchedData } from "express-validator";
import { calculateBudget } from "../utils/budget.js";
import { handleHttpError } from "../utils/handleError.js";
import { logEvent } from "../utils/handleLogger.js";

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

    await logEvent(`📁 Proyecto creado: ${nuevoProyecto.name}`);

    res.status(201).json({
      message: "Proyecto creado con éxito.",
      project: nuevoProyecto,
    });
  } catch (error) {
    handleHttpError(res, error);
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
    handleHttpError(res, error);
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

    if (!project) return handleHttpError(res, "Proyecto no encontrado", 404);
    res.json(project);
  } catch (error) {
    handleHttpError(res, error);
  }
};

// Actualizar proyecto
export const updateProject = async (req, res) => {
  try {
    const { id } = req.filteredData;
    const { usuario } = req;
    const data = req.filteredData;

    const existingProject = await Project.findById(id);
    if (!existingProject)
      return handleHttpError(res, "Proyecto no encontrado.", 404);

    // Validación de permisos
    if (
      usuario.rol !== "admin" &&
      !existingProject.responsibles.includes(usuario._id)
    ) {
      return handleHttpError(
        res,
        "No tienes permisos para actualizar este proyecto.",
        403
      );
    }

    // Validación de fechas coherentes
    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    ) {
      return handleHttpError(
        res,
        "La fecha de inicio no puede ser mayor que la de finalización.",
        400
      );
    }

    // Validación de responsables
    if (data.responsibles) {
      const validResponsibles = await User.find({
        _id: { $in: data.responsibles },
      });
      if (validResponsibles.length !== data.responsibles.length) {
        return handleHttpError(
          res,
          "Alguno de los responsables no existen.",
          400
        );
      }
    }

    // Validación de usuarios
    if (data.users) {
      const validUsers = await User.find({ _id: { $in: data.users } });
      if (validUsers.length !== data.users.length) {
        return handleHttpError(res, "Alguno de los usuarios no existen.", 400);
      }
    }

    // Validación de datos de contacto
    if (data.contactPerson) {
      const { name, email, phone } = data.contactPerson;
      if (!name || !email || !phone) {
        return handleHttpError(
          res,
          "La persona de contacto debe incluir nombre, correo y teléfono.",
          400
        );
      }
      data.contactPerson = { name, email, phone };
    }

    // Fusionar usuarios y responsables
    if (data.responsibles || data.users) {
      const uniqueUsers = [
        ...new Set([
          ...(data.responsibles || existingProject.responsibles),
          ...(data.users || existingProject.users),
        ]),
      ];
      data.users = uniqueUsers;
    }

    // Validación básica de presupuestos
    if (data.budget) {
      const budget = data.budget;

      // Calcular subtotales
      if (budget.tutors) {
        budget.tutors.subtotal =
          (budget.tutors.numTutors || 0) *
          (budget.tutors.estimatedHours || 0) *
          (budget.tutors.pricePerHour || 0);
      }

      if (budget.interns) {
        budget.interns.subtotal =
          (budget.interns.numInterns || 0) *
          (budget.interns.estimatedHours || 0) *
          (budget.interns.pricePerHour || 0);
      }

      //Gastos extras
      if (Array.isArray(budget.extraExpenses)) {
        budget.extraExpenses = budget.extraExpenses.map((item) => ({
          ...item,
          subtotal: item.quantity * item.unitPrice,
        }));
      }

      // Calcular total general
      const totalExtra = (budget.extraExpenses || []).reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      budget.totalGeneral =
        (budget.tutors?.subtotal || 0) +
        (budget.interns?.subtotal || 0) +
        totalExtra;

      data.budget = budget;
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

    await logEvent(`✏️ Proyecto actualizado: ${updatedProject?.name || id}`);

    return res.status(200).json({
      message: "Proyecto actualizado con éxito.",
      project: updatedProject,
    });
  } catch (error) {
    handleHttpError(res, error);
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
    if (!proyecto) return handleHttpError(res, "Proyecto no encontrado", 404);

    if (
      usuario.rol !== "admin" &&
      !proyecto.responsibles.includes(usuario._id)
    ) {
      return handleHttpError(
        res,
        "No tienes permisos para eliminar este proyecto.",
        403
      );
    }

    if (hardDelete) {
      // 🔥 Hard delete
      await Project.findByIdAndDelete(id);
      await User.updateMany({ projects: id }, { $pull: { projects: id } });
      await logEvent(`❌ Proyecto eliminado permanentemente: ${proyecto.name}`);

      return res.status(200).json({
        message: "Proyecto eliminado completamente (hard delete)",
      });
    } else {
      // 🗑️ Soft delete
      await proyecto.delete();
      await logEvent(`🗑️ Proyecto eliminado (soft delete): ${proyecto.name}`);
      return res.status(200).json({
        message: "Proyecto eliminado correctamente (soft delete)",
      });
    }
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const getDeletedProjects = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin")
      return handleHttpError(
        res,
        "Solo los administradores pueden ver proyectos eliminados.",
        403
      );

    const deleted = await Project.findDeleted()
      .populate("responsibles", "name")
      .populate("users", "name");
    res.status(200).json(deleted);
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const restoreProject = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin")
      return handleHttpError(
        res,
        "Solo los administradores pueden restaurar proyectos.",
        403
      );

    const { id } = req.filteredData;
    await Project.restore({ _id: id });
    const restoredProject = await Project.findById(id);

    await logEvent(`♻️ Proyecto restaurado: ${restoredProject?.name || id}`);

    res.status(200).json({
      message: "Proyecto restaurado correctamente.",
      restored: restoredProject,
    });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const addNotes = async (req, res) => {
  try {
    const {
      note,
      userWhoRecieves = [],
      tag = "no completada",
    } = matchedData(req);

    const projectId = req.params.id;
    console.log(projectId);

    const project = await Project.findById(projectId);
    if (!project) return handleHttpError(res, "Proyecto no encontrado", 404);

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

    // obtener la última nota (la recién añadida)
    const nuevaNota = project.pendingNotes[project.pendingNotes.length - 1];

    // popular el userWhoWrites
    await project.populate("pendingNotes.userWhoWrites", "name surname");

    return res.status(200).json(nuevaNota);
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteIndex, note, userWhoWrites, userWhoRecieves, tag } =
      matchedData(req);
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) return handleHttpError(res, "Proyecto no encontrado", 404);
    if (noteIndex < 0 || noteIndex >= project.pendingNotes.length) {
      return handleHttpError(res, "Índice no válido.", 404);
    }

    const existingNote = project.pendingNotes[noteIndex];

    const updatedNote = {
      ...existingNote.toObject(),
      ...(note && { note }),
      ...(userWhoWrites && { userWhoWrites }),
      ...(userWhoRecieves && { userWhoRecieves }),
      ...(tag && { tag }),
      date: Date.now(),
    };

    project.pendingNotes[noteIndex] = updatedNote;
    await project.save();

    return res.status(200).send({ message: "Nota actualizada correctamente." });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteIndex } = matchedData(req);
    console.log(noteIndex);
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) return handleHttpError(res, "Proyecto no encontrado", 404);
    if (noteIndex < 0 || noteIndex >= project.pendingNotes.length) {
      return handleHttpError(res, "Índice de nota no válido", 400);
    }

    project.pendingNotes.splice(noteIndex, 1);
    await project.save();

    return res.status(200).json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const hardDeleteProject = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin")
      return handleHttpError(
        res,
        "Solo los administradores pueden eliminar proyectos permanentemente.",
        403
      );

    const { id } = req.filteredData;
    const proyecto = await Project.findOneWithDeleted({ _id: id });
    if (!proyecto) return handleHttpError(res, "Proyecto no encontrado.", 404);

    // Eliminar referencia del proyecto en todos los usuarios
    await User.updateMany({ projects: id }, { $pull: { projects: id } });

    // Eliminar definitivamente el proyecto
    await Project.deleteOne({ _id: id });

    res
      .status(200)
      .json({ message: "Proyecto eliminado permanentemente (hard delete)." });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const updateProjectBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body.budget;

    const project = await Project.findById(id);
    if (!project) return handleHttpError(res, "Proyecto no encontrado", 404);

    if (!project.budget) {
      project.budget = {};
    }

    // fusionar valores enviados con los existentes
    const mergedBudget = {
      ...project.budget,
      ...updates,
      tutors: {
        ...project.budget.tutors,
        ...(updates.tutors || {}),
      },
      interns: {
        ...project.budget.interns,
        ...(updates.interns || {}),
      },
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

    await logEvent(`💰 Presupuesto actualizado para: ${project.name}`);

    return res.status(200).json({
      message: "Presupuesto actualizado correctamente",
      budget: project.budget,
    });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const addUsersToProject = async (req, res) => {
  const { id } = req.params;
  const { users = [], responsibles = [] } = req.filteredData;

  try {
    const proyecto = await Project.findById(id);
    if (!proyecto) return handleHttpError(res, "Proyecto no encontrado", 404);

    // Añadir responsables sin duplicados
    responsibles.forEach((userId) => {
      if (!proyecto.responsibles.includes(userId)) {
        proyecto.responsibles.push(userId);
      }
    });

    // Añadir participantes sin duplicados
    users.forEach((userId) => {
      if (!proyecto.users.includes(userId)) {
        proyecto.users.push(userId);
      }
    });

    await proyecto.save();

    await logEvent(`➕ Usuarios añadidos al proyecto: ${proyecto.name}`);

    res
      .status(200)
      .json({ message: "Usuarios añadidos correctamente", proyecto });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const removeUsersFromProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { users = [], responsibles = [] } = req.filteredData;
    const proyecto = await Project.findById(id);

    if (!proyecto) return handleHttpError(res, "Proyecto no encontrado", 404);

    // Filtrar responsables a eliminar
    proyecto.responsibles = proyecto.responsibles.filter(
      (idResponsable) => !responsibles.includes(idResponsable.toString())
    );

    // Filtrar usuarios a eliminar
    proyecto.users = proyecto.users.filter(
      (idUser) => !users.includes(idUser.toString())
    );

    await proyecto.save();

    await logEvent(`➖ Usuarios eliminados del proyecto: ${proyecto.name}`);

    res
      .status(200)
      .json({ message: "Usuarios eliminados correctamente", proyecto });
  } catch (error) {
    handleHttpError(res, error);
  }
};
