import Reservation from "../models/Reservation.js";
import Table from "../models/Tables.js";
import Project from "../models/Project.js";
import { handleHttpError } from "../utils/handleError.js";
import { logEvent } from "../utils/handleLogger.js";

//CREAR UNA RESERVA
export const createReservation = async (req, res) => {
  try {
    const { table, project, date, startTime, endTime } = req.body;
    const userId = req.usuario.id;

    // Verificar si la mesa existe
    const existingTable = await Table.findById(table);
    if (!existingTable) return handleHttpError(res, "Mesa no encontrada.", 404);

    // Verificar si el proyecto existe y el usuario pertenece a él
    const existingProject = await Project.findOne({
      _id: project,
      users: userId,
    });
    if (!existingProject)
      return handleHttpError(res, "No tienes acceso a este proyecto.", 403);

    // Construir fechas completas con hora
    const parsedDate = new Date(date);
    const startTimeParsed = new Date(`${date}T${startTime}:00`);
    const endTimeParsed = new Date(`${date}T${endTime}:00`);

    // Verificar solapamiento
    const overlappingReservation = await Reservation.findOne({
      table,
      date: parsedDate,
      $or: [
        { startTime: { $lt: endTimeParsed, $gte: startTimeParsed } },
        { endTime: { $gt: startTimeParsed, $lte: endTimeParsed } },
        {
          startTime: { $lte: startTimeParsed },
          endTime: { $gte: endTimeParsed },
        },
      ],
    });

    if (overlappingReservation)
      return handleHttpError(
        res,
        "La mesa ya está reservada en este horario.",
        400
      );

    // Crear la reserva
    const newReservation = new Reservation({
      user: userId,
      table,
      project,
      date: parsedDate,
      startTime: startTimeParsed,
      endTime: endTimeParsed,
      status: "pending",
    });

    await newReservation.save();

    await logEvent(
      `📅 Nueva reserva creada por ${req.usuario.email} para la mesa ${table} el ${date} de ${startTime} a ${endTime}`
    );

    res.status(201).json({
      message: "Reserva creada con éxito.",
      reservation: newReservation,
    });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const reservations = await Reservation.find({ user: userId })
      .populate("table", "name zone capacity")
      .populate("project", "name");

    if (reservations.length === 0)
      return handleHttpError(res, "No se encontraron reservas.", 404);
    res.status(200).json(reservations);
  } catch (error) {
    handleHttpError(res, error);
  }
};

//probar find().populate("table", "number zone capacity")
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("table", "name zone capacity")
      .populate("project", "name");

    if (reservations.length === 0)
      return handleHttpError(res, "No se encontraron reservas.", 404);

    // Devolver las reservas encontradas
    res.status(200).json(reservations);
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const approveReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation)
      return handleHttpError(res, "Reserva no encontrada.", 404);
    if (reservation.status === "approved")
      return handleHttpError(res, "La reserva ya está aprobada.", 400);

    reservation.status = "approved";
    await reservation.save();

    await logEvent(
      `✅ Reserva aprobada: ${reservation._id} para el usuario ${reservation.user}`
    );

    res
      .status(200)
      .json({ message: "Reserva aprobada con éxito.", reservation });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const rejectReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation)
      return handleHttpError(res, "Reserva no encontrada.", 404);
    if (reservation.status === "rejected")
      return handleHttpError(res, "La reserva ya está rechazada.", 400);

    reservation.status = "rejected";
    await reservation.save();

    await logEvent(`❌ Reserva rechazada: ${reservation._id}`);

    res
      .status(200)
      .json({ message: "Reserva rechazada con éxito.", reservation });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const reservation = await Reservation.findById(id);

    if (!reservation)
      return handleHttpError(res, "Reserva no encontrada.", 404);

    if (
      req.usuario.rol !== "admin" &&
      reservation.user.toString() !== req.usuario._id.toString()
    ) {
      return handleHttpError(
        res,
        "No tienes permisos para eliminar esta reserva.",
        403
      );
    }

    if (type === "hard") {
      await reservation.deleteOne();
      await logEvent(`🗑️ Reserva eliminada permanentemente: ${id}`);
      return res
        .status(200)
        .json({ message: "Reserva eliminada permanentemente." });
    }

    // Soft delete por defecto
    await reservation.delete();
    await logEvent(`📉 Reserva marcada como eliminada (soft): ${id}`);
    res
      .status(200)
      .json({ message: "Reserva marcada como eliminada (soft delete)." });
  } catch (error) {
    handleHttpError(res, error);
  }
};
