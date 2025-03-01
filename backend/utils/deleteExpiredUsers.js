import User from "../models/User.js";

/**
 * Elimina usuarios no verificados cuyos códigos hayan expirado.
 */
export const deleteExpiredUsers = async () => {
  try {
    const now = new Date();
    const result = await User.deleteMany({
      isVerified: false,
      verificationCodeExpires: { $lt: now },
    });

    if (result.deletedCount > 0) {
      console.log(
        `🗑️ Eliminados ${result.deletedCount} usuarios no verificados.`
      );
    }
  } catch (error) {
    console.error("❌ Error eliminando usuarios expirados:", error);
  }
};
