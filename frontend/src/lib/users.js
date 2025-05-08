"use server";
import { cookies } from "next/headers";

export async function getUsers() {
  try {
    const token = await getToken();

    const response = await fetch(`${process.env.BACK_URL}/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const token = await getToken();

    const response = await fetch(`${process.env.BACK_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting user: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

async function getToken() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    throw new Error("Token not found in cookies");
  }
  return token;
}


export async function fetchAllUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/users`, {
    credentials: "include", // si tu API lo requiere
    cache: "no-store",      // para no usar SWR o SSR cache
  });
  if (!res.ok) throw new Error(`fetchAllUsers: ${res.status}`);
  return res.json(); // espera un array de usuarios [{ _id, name, avatar, … }]
}
