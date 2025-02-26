import mongoose from "mongoose";

// Función para calcular la letra correcta del DNI
export const calcularLetraDNI = (dni) => {
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  return letras[dni % 23];
};

// Función de validación del DNI
export const validarDNI = (dni) => {
  const regex = /^\d{8}[A-Z]$/;
  if (!regex.test(dni)) return false;

  const numeros = parseInt(dni.slice(0, 8), 10);
  const letra = dni.charAt(8);

  return calcularLetraDNI(numeros) === letra;
};

// Función de validación de email
export const validarEmail = (email) => {
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
});

const User = mongoose.model("User", userSchema);

export default User;
