"use server";

import { cookies } from "next/headers";

export async function getProjects() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

export async function createProject(formData) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/projects/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error en el servidor: ${await res.text()}`);
    }

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.mensaje || "Error desconocido.");
    }

    return responseData.project;
  } catch (error) {
    console.error("Error al crear el proyecto:", error.message);
    throw new Error(error.message || "No se pudo crear el proyecto.");
  }
}

export async function getProjectById(projectId) {

  try {
    const res = await fetch(
      `${process.env.BACK_URL}/api/projects/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error al obtener el proyecto: ${res.statusText}`);
    }

    const project = await res.json();
    return project;
  } catch (error) {
    console.error("Error en getProjectById:", error.message);
    throw new Error(error.message || "No se pudo obtener el proyecto.");
  }
}

export async function updateProjectBudget(projectId, budgetData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/projects/budget/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(budgetData),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error del servidor: ${await res.text()}`);
    }

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Error desconocido.");
    }

    return responseData;
  } catch (error) {
    console.error("Error al actualizar el presupuesto:", error.message);
    throw new Error(error.message || "No se pudo actualizar el presupuesto.");
  }
}


export async function addNote(noteData, projectId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/projects/note/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(noteData),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error en el servidor: ${await res.text()}`);
    }

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Error desconocido.");
    }

    return responseData.message; // Puedes retornar el mensaje o el objeto completo si lo prefieres
  } catch (error) {
    console.error("Error al agregar la nota:", error.message);
    throw new Error(error.message || "No se pudo agregar la nota.");
  }
}

export async function updateNote(noteData, projectId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/projects/note/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(noteData),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Error en el servidor: ${await res.text()}`);
    }

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData.message || "Error desconocido.");
    }

    return responseData.message;
  } catch (error) {
    console.error("Error al actualizar la nota:", error.message);
    throw new Error(error.message || "No se pudo actualizar la nota.");
  }
}
