"use server";

import { cookies } from "next/headers";

export async function getProjects() {
  try {
    const token = cookies().get("token")?.value;

    // hacer petición con el token si existe
    const response = await fetch(`${process.env.BACK_URL}/api/projects`, {
      method: "GET",
      headers: token
        ? { Authorization: `Bearer ${token}` } // Enviar  token solo si existe
        : {}, //si no hay token, hacer la petición sin autenticación
    });

    if (!response.ok) {
      throw new Error(`Error al obtener proyectos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getProjects:", error);
    return [];
  }
}
