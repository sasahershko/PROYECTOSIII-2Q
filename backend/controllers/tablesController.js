import Table from "../models/Tables.js";


export const createTable = async (req, res) => {
  try {
    const { number, zone, capacity } = req.body;

    // Verificar si ya existe una mesa con el mismo número
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ message: "El número de mesa ya está en uso" });
    }

    const newTable = new Table({
      number,
      zone,
      capacity,
    });

    await newTable.save();

    res.status(200).json({
      message: "Mesa creada correctamente",
      table: newTable,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear la mesa",
      error: error.message,
    });
  }
};
