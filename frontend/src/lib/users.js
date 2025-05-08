
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

export async function updateUser(id, userData) {
  try {
    const token = await getToken();

    const response = await fetch(`${process.env.BACK_URL}/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar el usuario");
    }

    const data = await response.json();
    return data.user; // Devuelve el usuario actualizado
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    throw error;
  }
}
