import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import { validarEmail } from "../utils/validators/emailValidator.js";
import { validarDNI } from "../utils/validators/dniValidator.js";
// import { validarPassword } from "../utils/validators/passwordValidator.js"; // 👉 Descomentar para activar validación fuerte

const userSchema = new mongoose.Schema(
  {
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
      //   message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
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
    projects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: [] },
    ],
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationAttempts: { type: Number, default: 3 },
    verificationCodeExpires: { type: Date },
    profileImage: { type: String, default: null },
  },
  { timestamps: true }
);

// 🔄 Activar soft delete con mongoose-delete
userSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

const User = mongoose.model("User", userSchema);
export default User;
