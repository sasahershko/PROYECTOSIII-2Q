import mongoose from "mongoose";
import { validarEmail } from "../utils/validators/emailValidator.js";
import { validarDNI } from "../utils/validators/dniValidator.js";
// import { validarPassword } from "../utils/validators/passwordValidator.js"; // 👉 Descomentar para activar validación fuerte

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
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: validarPassword,
    //   message:
    //     "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
    // },
  },
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
    enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"],
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null },
  verificationAttempts: { type: Number, default: 3 },
  verificationCodeExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  profileImage: { type: String, default: null },

  // Soft delete
  isDeleted: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;
