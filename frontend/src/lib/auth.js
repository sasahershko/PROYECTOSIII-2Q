"use server";

import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();

// Función para login
export const loginUser = async (formData) => {
  try {
    // Verifica que el correo y la contraseña no estén vacíos antes de enviar
    if (!formData.email || !formData.password) {
      throw new Error("Correo y contraseña son obligatorios.");
    }

    const res = await fetch(`${process.env.BACK_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error en el servidor: ${await res.text()}`);
    }

    const responseData = await res.json();

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error(responseData.mensaje || "Faltan datos obligatorios.");
      }
      if (res.status === 401) {
        throw new Error(
          responseData.mensaje || "Correo o contraseña incorrectos."
        );
      }
      throw new Error(responseData.mensaje || "Error desconocido.");
    }

    // Guardar token en cookie segura
    const guardadoCookie = cookies();
    guardadoCookie.set("token", responseData.token, {
      path: "/",
      // httpOnly: true, si ponemos cookies en el cliente, no podemos poner httpOnly
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return responseData;
  } catch (error) {
    console.error("Error en el login:", error.message);
    throw new Error(error.message || "No se pudo completar el login.");
  }
};

// Función para registrar usuario
export const registerUser = async (formData) => {
  try {
    const res = await fetch(`${process.env.BACK_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error en el servidor: ${await res.text()}`);
    }

    const responseData = await res.json();

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error(responseData.mensaje || "Faltan datos obligatorios.");
      }
      if (res.status === 401) {
        throw new Error(
          responseData.mensaje || "Correo o contraseña incorrectos."
        );
      }
      throw new Error(responseData.mensaje || "Error desconocido.");
    }

    return responseData;
  } catch (error) {
    console.error("Error en el registro:", error.message);
    throw new Error(error.message || "No se pudo completar el registro.");
  }
};

// Función para verificar el código de autenticación
export const verifyUserCode = async ({ email, code }) => {
  try {
    const res = await fetch(`${process.env.BACK_URL}/api/users/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error en el servidor: ${await res.text()}`);
    }

    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.mensaje || "Código incorrecto.");
    }

    return responseData;
  } catch (error) {
    console.error("Error en la verificación de código:", error.message);
    throw new Error(error.message || "No se pudo verificar el código.");
  }
};
