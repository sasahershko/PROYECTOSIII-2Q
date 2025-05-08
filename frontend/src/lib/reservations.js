// lib/reservations.js
"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.BACK_URL;

/**
 * Obtiene todas las reservas (requiere rol admin).
 * @returns {Promise<Array>} Array de reservas
 * @throws si la petición falla
 */
export async function getReservations() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
  
    const res = await fetch(`${BASE_URL}/api/reservations/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  
    if (!res.ok) {
      console.error("fetch /all", res.status, res.statusText);
      throw new Error(`Error obteniendo reservas: ${res.statusText}`);
    }
  
    const data = await res.json();
    console.log("▶️ getReservations data:", data); // << aquí
    return data;
  }
  


/**
 * Aprueba una reserva por su ID.
 * @param {string} id  ID de la reserva
 * @returns {Promise<Object>}  Respuesta del servidor
 * @throws si la petición falla
 */
export async function approveReservation(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BASE_URL}/api/reservations/${id}/approve`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Error aprobando reserva ${id}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}


/**
 * Rechaza una reserva por su ID.
 * @param {string} id  ID de la reserva
 * @returns {Promise<Object>}  Respuesta del servidor
 * @throws si la petición falla
 */
export async function rejectReservation(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BASE_URL}/api/reservations/${id}/reject`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Error rechazando reserva ${id}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
