import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const deleteExpiredUnverifiedUsers = async () => {
  try {
    await connectDB(); // 🔄 Aquí sí puedes usar await

    const now = new Date();
    const result = await User.deleteMany({
      isVerified: false,
      isDeleted: false,
      verificationCodeExpires: { $lt: now },
    });

    console.log(`🧹 Usuarios eliminados del sistema: ${result.deletedCount}`);
  } catch (error) {
    console.error("❌ Error eliminando usuarios no verificados:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar si se llama directamente (desde terminal o cron)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  deleteExpiredUnverifiedUsers();
}

export default deleteExpiredUnverifiedUsers;
