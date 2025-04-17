// utils/emailService.js (versión con OAuth2 para Gmail)

import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.error("❌ Error al obtener accessToken:", err);
        return reject("Error al obtener el token de acceso.");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });

  return transporter;
};

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"Project Center U-TAD" <${process.env.EMAIL}>`,
      to: email,
      subject: "Tu código para registrarte en Project Center",
      text: `Tu código de verificación es: ${verificationCode}`,
      html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`,
      headers: {
        "X-Priority": "1 (Highest)",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
      replyTo: "noreply@u-tad.com",
    });
    console.log(`📧 Código enviado a ${email}`);
  } catch (error) {
    console.error("❌ Error enviando el email:", error);
    throw new Error("No se pudo enviar el correo de verificación.");
  }
};
