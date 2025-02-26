import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware para verificar si el usuario está autenticado
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "No autorizado. Token no proporcionado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await User.findById(decoded.id).select("-password"); // Excluye la contraseña

    if (!req.usuario) {
      return res
        .status(401)
        .json({ mensaje: "Token inválido o usuario no encontrado." });
    }

    next();
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 */
export const adminMiddleware = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({
        mensaje: "Acceso denegado. Se requieren permisos de administrador.",
      });
  }
  next();
};

/**
 * Middleware para verificar si el usuario es moderador o superior (admin)
 */
export const moderatorMiddleware = (req, res, next) => {
  if (
    !req.usuario ||
    (req.usuario.rol !== "admin" && req.usuario.rol !== "moderator")
  ) {
    return res
      .status(403)
      .json({
        mensaje: "Acceso denegado. Se requieren permisos de moderador o admin.",
      });
  }
  next();
};
