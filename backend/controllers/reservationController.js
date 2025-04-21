import Reservation from "../models/Reservation.js";
import Table from "../models/Tables.js";
import Project from "../models/Project.js";
import { handleHttpError } from "../utils/handleHttpError.js";

//CREAR UNA RESERVA
export const createReservation = async (req, res) => {
  try {
    const { table, project, date, startTime, endTime } = req.body;
    const userId = req.usuario.id;

    // Verificar si la mesa existe
    const existingTable = await Table.findById(table);
    if (!existingTable) return handleHttpError(res, "Mesa no encontrada.", 404);

    // Verificar si el proyecto existe y pertenece al usuario
    const existingProject = await Project.findOne({
      _id: project,
      members: userId,
    });
    if (!existingProject)
      return handleHttpError(res, "No tienes acceso a este proyecto.", 403);

    // Verificar disponibilidad de la mesa en la franja horaria
    const overlappingReservation = await Reservation.findOne({
      table,
      date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } }, // Se solapa al inicio
        { endTime: { $gt: startTime, $lte: endTime } }, // Se solapa al final
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }, // Contiene la reserva completamente
      ],
    });

    //if (overlappingReservation && overlappingReservation.status != "rejected") {
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
      date,
      startTime,
      endTime,
      status: "pending",
    });

    await newReservation.save();
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

    const reservations = await Reservation.find({ user: userId });

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
    const reservations = await Reservation.find();

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
      return res
        .status(200)
        .json({ message: "Reserva eliminada permanentemente." });
    }

    // Soft delete por defecto
    await reservation.delete();
    res
      .status(200)
      .json({ message: "Reserva marcada como eliminada (soft delete)." });
  } catch (error) {
    handleHttpError(res, error);
  }
};
