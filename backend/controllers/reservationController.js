import Reservation from "../models/Reservation.js";
import Table from "../models/Tables.js";
import Project from "../models/Project.js";


//CREAR UNA RESERVA
export const createReservation = async (req, res) => {
  try {
    const { table, project, date, startTime, endTime } = req.body;
    const userId = req.usuario.id;

    // Verificar si la mesa existe
    const existingTable = await Table.findById(table);
    if (!existingTable) {
      return res.status(404).json({ message: "Mesa no encontrada." });
    }


    // Verificar si el proyecto existe y pertenece al usuario
    const existingProject = await Project.findOne({ _id: project, members: userId });
    if (!existingProject) {
      return res.status(403).json({ message: "No tienes acceso a este proyecto." });
    }


    // Verificar disponibilidad de la mesa en la franja horaria
    const overlappingReservation = await Reservation.findOne({
      table,
      date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } }, // Se solapa al inicio
        { endTime: { $gt: startTime, $lte: endTime } },   // Se solapa al final
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }, // Contiene la reserva completamente
      ],
    });

    //if (overlappingReservation && overlappingReservation.status != "rejected") {
    if (overlappingReservation) {
      return res.status(400).json({ message: "La mesa ya está reservada en este horario." });
    }

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
    res.status(201).json({ message: "Reserva creada con éxito.", reservation: newReservation });

  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Error al crear la reserva." });
  }
};


export const getUserReservations = async (req, res) => {
  try {
    // El usuario autenticado está en req.usuario debido al middleware de autenticación
    const userId = req.usuario._id;

    // Buscar todas las reservas del usuario autenticado
    const reservations = await Reservation.find({ user: userId });

    if (reservations.length === 0) {
      return res.status(404).json({ message: "No se encontraron reservas." });
    }

    // Devolver las reservas encontradas
    res.status(200).json(reservations);
  } catch (error) {
    //console.error("Error al obtener las reservas del usuario:", error);
    res.status(500).json({ message: "Error al obtener las reservas del usuario." });
  }
};