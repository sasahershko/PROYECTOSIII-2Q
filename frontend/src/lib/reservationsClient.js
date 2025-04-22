// lib/reservationsClient.js
"use client";

import { getTokenFromClient } from "./authClient";

const API_URL = `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:5000'}/api/reservations`;

export async function createReservation(reservationData) {
  const token = getTokenFromClient();
  if (!token) throw new Error("Debes iniciar sesión para realizar una reserva.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reservationData),
  });

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear la reserva.");
  return data;
}

export async function getReservations() {
  const token = getTokenFromClient();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(API_URL, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener reservas: " + res.statusText);
  return res.json();
}

export async function deleteReservation(id) {
  const token = getTokenFromClient();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al eliminar la reserva.");
  return data.message;
}
