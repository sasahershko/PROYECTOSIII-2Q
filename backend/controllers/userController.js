import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import { generateVerificationCode } from "../utils/verification.js";
import { sendVerificationEmail } from "../utils/emailService.js";

//(estos son solo informativos, no salen en Swagger)
/**
 * @desc Registrar un nuevo usuario
 * @route POST /api/users/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password, dni, grade } = req.filteredData;

    // Comprobar si el usuario ya existe por email o DNI
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está en uso." });
    }

    const dniExistente = await User.findOneWithDeleted({ dni });
    if (dniExistente) {
      return res.status(400).json({ mensaje: "El DNI ya está registrado." });
    }

    // Hashear contraseña y generar código
    const verificationCode = generateVerificationCode();
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 10
    );

    const nuevoUsuario = new User({
      name,
      surname,
      email,
      password: passwordHasheada,
      dni,
      grade,
      rol: "user",
      isVerified: false,
      verificationCode,
      verificationAttempts: 3,
      verificationCodeExpires,
    });

    await nuevoUsuario.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      mensaje: "Usuario registrado. Verifica tu correo en 10 minutos.",
    });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};

/**
 * @desc Verificar el código de autenticación enviado al correo del usuario
 * @route POST /api/users/verify-code
 * @access Public
 */
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.filteredData;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ mensaje: "Este usuario ya está verificado." });
    }

    const now = new Date();
    if (now > new Date(user.verificationCodeExpires)) {
      await User.deleteOne({ email });
      return res
        .status(400)
        .json({ mensaje: "Código expirado. Regístrate de nuevo." });
    }

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      user.verificationAttempts = null;
      await user.save();
      return res.json({ mensaje: "Código correcto, usuario verificado." });
    } else {
      user.verificationAttempts -= 1;

      if (user.verificationAttempts <= 0) {
        await User.deleteOne({ email });
        return res.status(400).json({
          mensaje: "Demasiados intentos fallidos. Regístrate de nuevo.",
        });
      }

      await user.save();
      return res.status(400).json({
        mensaje: `Código incorrecto. Intentos restantes: ${user.verificationAttempts}`,
      });
    }
  } catch (error) {
    console.error("❌ Error en verifyCode:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};

/**
 * @desc Reenviar código de verificación al correo del usuario
 * @route POST /api/users/resend-verification
 * @access Public
 */
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.filteredData;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ mensaje: "El usuario ya está verificado." });
    }

    const now = new Date();
    if (
      user.lastResendRequest &&
      now - new Date(user.lastResendRequest) < 50000
    ) {
      return res
        .status(400)
        .json({ mensaje: "Espera antes de solicitar un nuevo código." });
    }

    const newVerificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 10
    );

    user.verificationCode = newVerificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    user.lastResendRequest = now;

    await user.save();
    await sendVerificationEmail(email, newVerificationCode);

    res.json({ mensaje: "Código reenviado. Revisa tu correo." });
  } catch (error) {
    console.error("❌ Error en resendVerificationCode:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};

/**
 * @desc Iniciar sesión y obtener un token JWT
 * @route POST /api/users/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.filteredData;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(401)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    if (!usuario.isVerified) {
      return res.status(403).json({
        mensaje: "Debes verificar tu cuenta antes de iniciar sesión.",
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res
        .status(401)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        grade: usuario.grade,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax`
    );

    return res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario._id,
        name: usuario.name,
        surname: usuario.surname,
        email: usuario.email,
        grade: usuario.grade,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};

/**
 * @desc Obtener perfil del usuario autenticado
 * @route GET /api/users/profile
 * @access Private (requiere token)
 */
export const getUserProfile = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensaje: "No autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findOne({
      _id: decoded.id,
    }).select("name email role");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.status(200).json({
      id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      rol: usuario.rol,
    });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

/**
 * @desc Obtener el perfil de un usuario por su ID (público)
 * @route GET /api/users/profile/:id
 * @access Public (no requiere autenticación)
 */
export const getUserProfileById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      deleted: false,
    }).select("-password -email");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Obtener todos los usuarios (requiere autenticación)
 * @route GET /api/users
 * @access Private (requiere token)
 */
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password");
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("❌ Error en getAllUsers:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};

/**
 * @desc Cambiar rol de un usuario (requiere ser admin y tener token)
 * @route PUT /api/users/update-role/:id
 * @access Private (requiere ser admin y tener token)
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.filteredData;
    const { name, surname, rol, grade, profileImage } = req.filteredData;

    const usuarioAutenticado = req.usuario;
    const isAdmin = usuarioAutenticado.rol === "admin";
    const isSameUser = usuarioAutenticado.id === id;

    if (!isSameUser && !isAdmin) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este usuario." });
    }

    if (req.body.email || req.body.password) {
      return res
        .status(400)
        .json({ message: "No puedes modificar el correo ni la contraseña." });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (surname) updatedData.surname = surname;
    if (profileImage) updatedData.profileImage = profileImage;
    if (grade) updatedData.grade = grade;
    if (rol && isAdmin) updatedData.rol = rol;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({
      message: "Usuario actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("🚨 Error en updateUser:", error);
    res.status(500).json({ message: "Error al actualizar el usuario.", error });
  }
};

/**
 * @desc Eliminar usuario (propio o admin) y limpiar referencias en proyectos
 * @route DELETE /api/users/:id
 * @access Private (usuario autenticado o admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.filteredData;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await user.delete(); // Soft delete con mongoose-delete
    res.status(200).json({ mensaje: "Usuario eliminado (soft delete)" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar usuario", error: error.message });
  }
};

export const getDeletedUsers = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje: "Solo los administradores pueden ver usuarios eliminados.",
      });
    }

    const deletedUsers = await User.findDeleted().select(
      "name surname email rol grade deletedAt"
    );
    res.status(200).json(deletedUsers);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuarios eliminados",
      error: error.message,
    });
  }
};

export const restoreUser = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje: "Solo los administradores pueden restaurar usuarios.",
      });
    }

    const { id } = req.filteredData;

    await User.restore({ _id: id }); // Restaurar soft delete

    res.status(200).json({
      mensaje: "Usuario restaurado correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al restaurar usuario",
      error: error.message,
    });
  }
};

export const hardDeleteUser = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        mensaje:
          "Solo los administradores pueden eliminar usuarios permanentemente.",
      });
    }

    const { id } = req.filteredData;

    const user = await User.findOneWithDeleted({ _id: id });
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Eliminar referencias del usuario en los proyectos
    await Project.updateMany(
      { $or: [{ responsibles: id }, { users: id }] },
      {
        $pull: {
          responsibles: id,
          users: id,
        },
      }
    );

    // Eliminar definitivamente el usuario
    await User.deleteOne({ _id: id });

    res
      .status(200)
      .json({ mensaje: "Usuario eliminado permanentemente (hard delete)." });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar usuario permanentemente",
      error: error.message,
    });
  }
};
