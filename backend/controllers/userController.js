import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import { generateVerificationCode } from "../utils/verification.js";
import { sendVerificationEmail } from "../utils/emailService.js";

dotenv.config();

//Configuración de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//(estos son solo informativos, no salen en Swagger)
/**
 * @desc Registrar un nuevo usuario
 * @route POST /api/users/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password, dni, grade } = req.body;

    // Validación de campos obligatorios
    if (!name || !surname || !email || !password || !dni || !grade) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Validación de email (debe ser de U-TAD)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:live\.u-tad\.com|u-tad\.com)$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ mensaje: "El correo debe ser de la Universidad." });
    }

    // Validación de formato de DNI (8 números + 1 letra correcta)
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    const letrasDNI = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numeroDNI = parseInt(dni.slice(0, -1), 10);
    const letraDNI = dni.slice(-1).toUpperCase();
    if (!dniRegex.test(dni) || letrasDNI[numeroDNI % 23] !== letraDNI) {
      return res.status(400).json({ mensaje: "El DNI no es válido." });
    }

    // Validación de la contraseña (mínimo 8 caracteres, una mayúscula, una minúscula y un número)
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     mensaje:
    //       "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
    //   });
    // }

    // Validación de grado permitido
    const gradosPermitidos = ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"];
    if (!gradosPermitidos.includes(grade)) {
      return res
        .status(400)
        .json({ mensaje: "El grado seleccionado no es válido." });
    }

    // Comprobar si el usuario ya existe por email o DNI
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está en uso." });
    }

    const dniExistente = await User.findOne({ dni });
    if (dniExistente) {
      return res.status(400).json({ mensaje: "El DNI ya está registrado." });
    }

    // Si pasa todas las validaciones, continuar con el registro provisional
    const verificationCode = generateVerificationCode();
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(password, salt);

    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 10
    ); // Expira en 10 minutos

    const nuevoUsuario = new User({
      name,
      surname,
      email,
      password: passwordHasheada,
      dni,
      grade,
      rol: "user",
      isVerified: false, // Usuario provisional hasta que verifique
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

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ mensaje: "Este usuario ya está verificado." });
    }

    // Si el código ha expirado, eliminar el usuario
    const now = new Date();
    if (now > new Date(user.verificationCodeExpires)) {
      await User.deleteOne({ email }); // Elimina el usuario de la BD
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
        await User.deleteOne({ email }); // Elimina el usuario si agotó intentos
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

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(401)
        .json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // **Bloqueo de login si el usuario no está verificado**
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

    // Generar token JWT
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

    // 🔥 Configurar cookie en la respuesta HTTP
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
    console.error("❌ Error en el servidor:", error);
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
    // Obtener el token desde las cookies o el header Authorization
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensaje: "No autorizado" });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario en la base de datos
    const usuario = await User.findById(decoded.id).select("name email role");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Devolver solo la información necesaria
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
    // Buscar el usuario por ID excluyendo la contraseña y el email
    const user = await User.findById(req.params.id).select("-password -email");

    // Si el usuario no existe, devolver un error 404
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Responder con la información del usuario
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * @desc Eliminar usuario (propio o admin)
 * @route DELETE /api/users/:id
 * @access Private (usuario autenticado o admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const usuarioAutenticado = req.usuario; // Usuario autenticado (quien hace la petición)
    const { id } = req.params; // ID del usuario que se quiere eliminar

    const usuarioAEliminar = await User.findById(id);
    if (!usuarioAEliminar) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (
      usuarioAutenticado.rol !== "admin" &&
      usuarioAutenticado._id.toString() !== id
    ) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permisos para eliminar este usuario." });
    }

    await usuarioAEliminar.deleteOne();
    res.status(200).json({ mensaje: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};

/**
 * @desc Obtener todos los usuarios (requiere autenticación)
 * @route GET /api/users
 * @access Private (requiere token)
 */
export const getAllUsers = async (req, res) => {
  try {
    // Buscar todos los usuarios excepto las contraseñas
    const usuarios = await User.find().select("-password");

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

/**
 * @desc Cambiar rol de un usuario (requiere ser admin y tener token)
 * @route PUT /api/users/update-role/:id
 * @access Private (requiere ser admin y tener token)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    usuario.rol = rol;
    await usuario.save();

    res.status(200).json({ mensaje: `Rol actualizado a ${rol}.` });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
};
