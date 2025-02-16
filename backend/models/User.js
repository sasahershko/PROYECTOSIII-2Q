import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Ahora es nombre completo
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ["admin", "moderator", "user"],
    default: "user"
  },
  grado: {
    type: String,
    required: true,
    enum: ["INSO", "MAIS", "FIIS", "DIPI", "ANIV"], // Solo permite estos valores
  },
});

const User = mongoose.model("User", userSchema);

export default User;
