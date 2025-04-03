export const adminOrSelfMiddleware = (req, res, next) => {
  const { id } = req.params;
  const usuario = req.usuario;

  if (!usuario) {
    return res.status(401).json({ mensaje: "No autenticado." });
  }

  const esAdmin = usuario.rol === "admin";
  const esElMismo = usuario._id?.toString() === id;

  if (!esAdmin && !esElMismo) {
    return res.status(403).json({
      mensaje: "No tienes permiso para realizar esta acción.",
    });
  }

  next();
};
