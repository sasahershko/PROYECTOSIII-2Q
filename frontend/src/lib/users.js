"use server";
import { cookies } from "next/headers";

export async function getUsers() {
  try {
    const token = getToken();

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
    const token = getToken();

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
    console.error("Error deleting users:", error);
    throw error;
  }
}

function getToken() {
  const token = cookies().get("token")?.value;
  if (!token) {
    throw new Error("Token not found in cookies");
  }
  return token;
}
