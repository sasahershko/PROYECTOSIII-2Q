"use server";

import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();

// Función para login
export const loginUser = async (formData) => {
  try {
    const res = await fetch(`${process.env.BACK_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const responseData = await res.json();
      throw new Error(responseData.mensaje);
    }

    const responseData = await res.json();

    // Guardar el token JWT en una cookie
    const guardadoCookie = cookies();
    guardadoCookie.set("token", responseData.token, {
      path: "/",
      // httpOnly: true, si ponemos cookies en el cliente, no podemos poner httpOnly
    });

    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Función para register
export const registerUser = async (formData) => {
  try {
    const res = await fetch(`${process.env.BACK_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const responseData = await res.json();
      throw new Error(responseData.mensaje);
    }

    const responseData = await res.json();

    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
};
