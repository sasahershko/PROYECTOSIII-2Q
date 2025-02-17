import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

//(estos son solo informativos, no salen en Swagger)
/**
 * @desc Registrar un nuevo usuario
 * @route POST /api/users/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password, dni, grade } = req.body;

    if (!name || !surname || !email || !password || !dni || !grade) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    const gradosPermitidos = ["INSO", "MAIS", "FIIS"];
    if (!gradosPermitidos.includes(grade)) {
      return res
        .status(400)
        .json({ mensaje: "Grado no válido. Debe ser INSO, MAIS o FIIS." });
    }

    const usuarioExistente = await User.findOne({ email }).exec();
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está en uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      name,
      surname,
      email,
      password: passwordHasheada,
      dni,
      grade,
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

/**
 * @desc Iniciar sesión y obtener un token JWT
 * @route POST /api/users/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    const usuario = await User.findOne({ email }).exec();
    if (!usuario) {
      return res
        .status(401)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res
        .status(401)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // 📌 Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, grade: usuario.grade, rol: usuario.rol},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario._id,
        name: usuario.name,
        surname: usuario.surname,
        email: usuario.email,
        grade: usuario.grade,
        rol: usuario.rol
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

/**
 * @desc Obtener perfil del usuario autenticado
 * @route GET /api/users/profile
 * @access Private (requiere token)
 */
export const getUserProfile = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id).select("-password");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

/**
 * @desc Eliminar usuario (propio o admin)
 * @route DELETE /api/users/:id
 * @access Private (usuario autenticado o admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const usuarioAutenticado = req.usuario; // Usuario autenticado
    const { id } = req.params; // ID del usuario a eliminar

    const usuarioAEliminar = await User.findById(id);

    if (!usuarioAEliminar) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Permitir el delete solo si un usuario se borra a sí mismo o si es admin
    if (usuarioAutenticado.rol !== "admin" && usuarioAutenticado.id !== id) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para eliminar este usuario" });
    }

    await usuarioAEliminar.deleteOne();
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
