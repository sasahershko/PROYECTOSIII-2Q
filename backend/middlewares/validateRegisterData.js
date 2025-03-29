import { validarEmail } from "../utils/validators/emailValidator.js";
import { validarDNI } from "../utils/validators/dniValidator.js";

export const validateRegisterData = (req, res, next) => {
  const { name, surname, email, password, dni, grade } = req.body;

  if (!name || !surname || !email || !password || !dni || !grade) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }

  if (!validarEmail(email)) {
    return res
      .status(400)
      .json({ mensaje: "El correo debe ser de la Universidad." });
  }

  if (!validarDNI(dni)) {
    return res.status(400).json({ mensaje: "El DNI no es válido." });
  }

  const gradosPermitidos = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"];
  if (!gradosPermitidos.includes(grade)) {
    return res
      .status(400)
      .json({ mensaje: "El grado seleccionado no es válido." });
  }

  next();
};
