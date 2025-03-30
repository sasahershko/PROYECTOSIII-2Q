import nodemailer from "nodemailer";
import "./../config/env.js";

// Configuración del servicio de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes usar otro proveedor (Outlook, SMTP, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Email del remitente
    pass: process.env.EMAIL_PASS, // Contraseña o App Password
  },
});

// Función para enviar correo de verificación
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    await transporter.sendMail({
      from: `"Verificación U-TAD" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${verificationCode}`,
    });
    console.log(`📧 Código enviado a ${email}`);
  } catch (error) {
    console.error("❌ Error enviando el email:", error);
    throw new Error("No se pudo enviar el correo de verificación.");
  }
};
