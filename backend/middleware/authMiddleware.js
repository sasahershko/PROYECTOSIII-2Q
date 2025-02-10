import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido." });
  }
};

export default verificarToken;
