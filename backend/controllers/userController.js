import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import { generateVerificationCode } from "../utils/verification.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import { handleHttpError } from "../utils/handleHttpError.js";
import { logEvent } from "../utils/handleLogger.js";

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
    if (usuarioExistente)
      return handleHttpError(res, "El correo ya está en uso.", 400);

    const dniExistente = await User.findOneWithDeleted({ dni });
    if (dniExistente)
      return handleHttpError(res, "El DNI ya está registrado.", 400);

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
    await logEvent(`🆕 Usuario registrado: ${email}`);
    await logEvent(`📧 Código de verificación enviado a ${email}`);

    res.status(201).json({
      message: "Usuario registrado. Verifica tu correo en 10 minutos.",
    });
  } catch (error) {
    handleHttpError(res, error);
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

    if (!user) return handleHttpError(res, "Usuario no encontrado.", 404);
    if (user.isVerified)
      return handleHttpError(res, "Este usuario ya está verificado.", 400);

    const now = new Date();
    if (now > new Date(user.verificationCodeExpires)) {
      await User.deleteOne({ email });
      return handleHttpError(res, "Código expirado. Regístrate de nuevo.", 400);
    }

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      user.verificationAttempts = null;
      await user.save();
      await logEvent(`🔓 Usuario verificado: ${email}`);
      return res.json({ message: "Código correcto, usuario verificado." });
    } else {
      user.verificationAttempts -= 1;

      if (user.verificationAttempts <= 0) {
        await User.deleteOne({ email });
        await logEvent(`❌ Usuario eliminado por intentos fallidos: ${email}`);
        return handleHttpError(
          res,
          "Demasiados intentos fallidos. Regístrate de nuevo.",
          400
        );
      }

      await user.save();
      return handleHttpError(
        res,
        `Código incorrecto. Intentos restantes: ${user.verificationAttempts}`,
        400
      );
    }
  } catch (error) {
    handleHttpError(res, error);
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

    if (!user) return handleHttpError(res, "Usuario no encontrado.", 404);
    if (user.isVerified)
      return handleHttpError(res, "El usuario ya está verificado.", 400);

    const now = new Date();
    if (
      user.lastResendRequest &&
      now - new Date(user.lastResendRequest) < 50000
    ) {
      return handleHttpError(
        res,
        "Espera antes de solicitar un nuevo código.",
        400
      );
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
    await logEvent(`🔁 Código reenviado a ${email}`);

    res.json({ message: "Código reenviado. Revisa tu correo." });
  } catch (error) {
    handleHttpError(res, error);
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

    if (!usuario)
      return handleHttpError(res, "Correo o contraseña incorrectos", 401);
    if (!usuario.isVerified)
      return handleHttpError(
        res,
        "Debes verificar tu cuenta antes de iniciar sesión.",
        403
      );

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida)
      return handleHttpError(res, "Correo o contraseña incorrectos", 401);

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

    await logEvent(`✅ Login exitoso para ${email}`);

    return res.json({
      message: "Login exitoso",
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
    handleHttpError(res, error);
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

    if (!token) return handleHttpError(res, "No autorizado", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await User.findById(decoded.id)
      .select("name surname email dni rol grade profileImage projects")
      .populate("projects", "title status deadline");

    if (!usuario) return handleHttpError(res, "Usuario no encontrado.", 404);

    res.status(200).json({
      id: usuario._id,
      name: usuario.name,
      surname: usuario.surname,
      email: usuario.email,
      dni: usuario.dni,
      rol: usuario.rol,
      grade: usuario.grade,
      profileImage: usuario.profileImage,
      projects: usuario.projects,
    });
  } catch (error) {
    handleHttpError(res, "Token inválido o expirado", 401);
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
    })
      .select("name surname email dni rol grade profileImage projects")
      .populate("projects", "title status deadline");

    if (!user) return handleHttpError(res, "Usuario no encontrado", 404);

    res.status(200).json({
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      dni: user.dni,
      rol: user.rol,
      grade: user.grade,
      profileImage: user.profileImage,
      projects: user.projects,
    });
  } catch (error) {
    handleHttpError(res, error);
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
    handleHttpError(res, error);
  }
};

/**
 * @desc Cambiar rol de un usuario (requiere ser admin y tener token)
 * @route PUT /api/users/update-role/:id
 * @access Private (requiere ser admin y tener token)
 */
export const updateUser = async (req, res) => {
  try {
    const { id, name, surname, rol, grade, profileImage } = req.filteredData;
    const usuarioAutenticado = req.usuario;
    const isAdmin = usuarioAutenticado.rol === "admin";
    const isSameUser = usuarioAutenticado.id === id;

    if (!isSameUser && !isAdmin)
      return handleHttpError(
        res,
        "No tienes permiso para editar este usuario.",
        403
      );

    if (req.body.email || req.body.password)
      return handleHttpError(
        res,
        "No puedes modificar el correo ni la contraseña.",
        400
      );

    const updatedData = {};
    if (name) updatedData.name = name;
    if (surname) updatedData.surname = surname;
    if (profileImage) updatedData.profileImage = profileImage;
    if (grade) updatedData.grade = grade;
    if (rol && isAdmin) updatedData.rol = rol;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser)
      return handleHttpError(res, "Usuario no encontrado.", 404);

    await logEvent(`✏️ Usuario actualizado: ${updatedUser.email}`);

    res.status(200).json({
      message: "Usuario actualizado correctamente.",
      user: updatedUser,
    });
  } catch (error) {
    handleHttpError(res, error);
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
    if (!user) return handleHttpError(res, "Usuario no encontrado", 404);

    await user.delete(); // Soft delete con mongoose-delete
    await logEvent(`🗑️ Usuario eliminado (soft): ${user.email}`);
    res.status(200).json({ message: "Usuario eliminado (soft delete)" });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const getDeletedUsers = async (req, res) => {
  try {
    if (!req.usuario || req.usuario.rol !== "admin")
      return handleHttpError(
        res,
        "Solo los administradores pueden ver usuarios eliminados.",
        403
      );

    const deletedUsers = await User.findDeleted({ deleted: true }).select(
      "name surname email rol grade deletedAt"
    );

    res.status(200).json(deletedUsers);
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const restoreUser = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin")
      return handleHttpError(
        res,
        "Solo los administradores pueden restaurar usuarios.",
        403
      );

    const { id } = req.filteredData;
    await User.restore({ _id: id });

    const restoredUser = await User.findById(id);
    await logEvent(`♻️ Usuario restaurado: ${restoredUser?.email || id}`);

    res.status(200).json({ message: "Usuario restaurado correctamente." });
  } catch (error) {
    handleHttpError(res, error);
  }
};

export const hardDeleteUser = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin")
      return handleHttpError(
        res,
        "Solo los administradores pueden eliminar usuarios permanentemente.",
        403
      );

    const { id } = req.filteredData;
    const user = await User.findOneWithDeleted({ _id: id });
    if (!user) return handleHttpError(res, "Usuario no encontrado.", 404);

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
    await logEvent(`❌ Usuario eliminado permanentemente: ${user.email}`);

    res
      .status(200)
      .json({ message: "Usuario eliminado permanentemente (hard delete)." });
  } catch (error) {
    handleHttpError(res, error);
  }
};
