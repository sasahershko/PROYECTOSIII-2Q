import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  surname: {type: String,require: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dni: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ["admin", "moderator", "user"],
    default: "user"
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
