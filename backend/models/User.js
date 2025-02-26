import mongoose from "mongoose";

// Función para calcular la letra correcta del DNI
const calcularLetraDNI = (dni) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  return letras[dni % 23];
};

// Función de validación del DNI
const validarDNI = (dni) => {
  const regex = /^\d{8}[A-Z]$/;
  if (!regex.test(dni)) return false;

  const numeros = parseInt(dni.slice(0, 8), 10);
  const letra = dni.charAt(8);

  return calcularLetraDNI(numeros) === letra;
};

// Función de validación de email
const validarEmail = (email) => {
  return /@u-tad\.com$|@live\.u-tad\.com$/.test(email);
};

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

  //Campos para la verificación del código de 6 dígitos
  isVerified: { type: Boolean, default: false }, // Indica si el usuario ya verificó su cuenta
  verificationCode: { type: String, default: null }, // Código de verificación temporal
  verificationAttempts: { type: Number, default: 3 }, // Número de intentos para ingresar el código
 
});

const User = mongoose.model("User", userSchema);

export default User;
