/**
 * Middleware para verificar si el usuario es administrador
 */
export const adminMiddleware = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== "admin") {
      return res.status(403).json({
        message: "Acceso denegado. Se requieren permisos de administrador.",
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
      return res.status(403).json({
        message: "Acceso denegado. Se requieren permisos de moderador o admin.",
      });
    }
    next();
  };