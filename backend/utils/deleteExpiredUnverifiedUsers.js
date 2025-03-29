import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const deleteExpiredUnverifiedUsers = async () => {
  try {
    await connectDB();

    const now = new Date();
    const result = await User.deleteMany({
      isVerified: false,
      isDeleted: false,
      verificationCodeExpires: { $lt: now },
    });

    console.log(`🧹 Usuarios eliminados del sistema: ${result.deletedCount}`);
  } catch (error) {
    console.error("❌ Error eliminando usuarios no verificados:", error);
  }
};

// Si el archivo se ejecuta directamente desde terminal
if (process.argv[1] === new URL(import.meta.url).pathname) {
  deleteExpiredUnverifiedUsers().finally(() => {
    mongoose.connection.close();
  });
}

export default deleteExpiredUnverifiedUsers;
