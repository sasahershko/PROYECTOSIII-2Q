"use server";

import { cookies } from "next/headers";

export async function createReservation(data) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(await res.text());
    }

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Error al crear la reserva.");
    }

    return json.reservation;
  } catch (err) {
    console.error("Error al crear reserva:", err.message);
    throw err;
  }
}

export async function deleteReservation(reservationId) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/reservations/${reservationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ id: reservationId })
    });

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar la reserva");
    }

    return data.message;
  } catch (error) {
    console.error("Error al eliminar reserva:", error.message);
    throw error;
  }
}

export async function getUserReservations() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.BACK_URL}/api/reservations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      throw new Error("No autorizado o error al obtener reservas.");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error en getUserReservations:", err.message);
    return [];
  }
}

export async function getAllReservations() {
  try {
    const res = await fetch(`${process.env.BACK_URL}/api/reservations`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      throw new Error("Error al obtener reservas.");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error en getAllReservations:", err.message);
    return [];
  }
}

export async function getAvailableTables({ date, startTime, endTime }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const params = new URLSearchParams({
      date,
      startTime,
      endTime
    });

    const res = await fetch(`${process.env.BACK_URL}/api/reservations/tables/available?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    if (!res.ok) throw new Error("Error al obtener mesas disponibles.");
    return await res.json();
  } catch (err) {
    console.error("Error en getAvailableTables:", err.message);
    return [];
  }
}