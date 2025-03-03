import mongoose from "mongoose";
import { validarEmail, validarDNI } from "../utils/validators.js"; // Importamos validaciones externas

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validarEmail,
      message: "Solo se permiten correos de U-TAD.",
    },
  },
  password: { type: String, required: true },
  dni: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validarDNI,
      message: "DNI inválido. Debe seguir el formato correcto.",
    },
  },
  rol: {
    type: String,
    required: true,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
  grade: {
    type: String,
    required: true,
    enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"], // Solo permite estos valores
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], //relacion inversa

  // Campos para la verificación del código de 6 dígitos
  isVerified: { type: Boolean, default: false }, // Indica si el usuario ya verificó su cuenta
  verificationCode: { type: String, default: null }, // Código de verificación temporal
  verificationAttempts: { type: Number, default: 3 }, // Número de intentos
  verificationCodeExpires: { type: Date }, // Expiración del código
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

const User = mongoose.model("User", userSchema);

export default User;
