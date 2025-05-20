import Table from "../models/Tables.js";
import Reservation from "../models/Reservation.js";
import { matchedData } from "express-validator";
import { handleHttpError } from "../utils/handleError.js";

// Crear una mesa
const createTable = async (req, res) => {
  try {
    const data = matchedData(req);
    const newTable = await Table.create(data);
    res.status(201).json(newTable);
  } catch (err) {
    handleHttpError(res, "ERROR_CREATE_TABLE");
  }
};

// Obtener todas las mesas
const getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    handleHttpError(res, "ERROR_GET_TABLES");
  }
};

// Obtener mesas disponibles en una fecha/hora
const getAvailableTables = async (req, res) => {
  try {
    const { date, time } = matchedData(req);

    const reserved = await Reservation.find({ date, time }).select("tableId");
    const reservedIds = reserved.map((r) => r.tableId.toString());

    const availableTables = await Table.find({ _id: { $nin: reservedIds } });
    res.json(availableTables);
  } catch (err) {
    handleHttpError(res, "ERROR_GET_AVAILABLE_TABLES");
  }
};

export { createTable, getTables, getAvailableTables };
