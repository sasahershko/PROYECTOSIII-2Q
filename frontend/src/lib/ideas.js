"use server";
import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();

// Obtiene la lista completa de ideas 
export async function getIdeas() {
  const res = await fetch(`${process.env.BACK_URL}/api/ideas`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener las ideas");
  return res.json();
}

// Busca una idea por su id
export async function getIdeaById(id) {
  const res = await fetch(`${process.env.BACK_URL}/api/ideas/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener la idea");
  return res.json();
}

// Crea una nueva idea
export async function createIdea(ideaData) {
  const res = await fetch(`${process.env.BACK_URL}/api/ideas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ideaData),
  });
  if (!res.ok) throw new Error("Error al crear la idea");
  return res.json();
}

// Actualiza los datos de una idea 
export async function updateIdea(id, ideaData) {
  const res = await fetch(`${process.env.BACK_URL}/api/ideas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ideaData),
  });
  if (!res.ok) throw new Error("Error al actualizar la idea");
  return res.json();
}

// Elimina una idea por su ID
export async function deleteIdea(id) {
  const res = await fetch(`${process.env.BACK_URL}/api/ideas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar la idea");
}
