import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      // La validación se hace con express-validator
    },
    password: {
      type: String,
      required: true,
      // Validación por express-validator
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      // Validación por express-validator
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
