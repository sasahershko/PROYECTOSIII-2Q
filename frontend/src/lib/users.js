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

export async function updateUser(userId, form) {
  const token = await getToken();
  const fd = new FormData();

  // agrega campos de texto
  for (const [k,v] of Object.entries(form)) {
    if (k === "file") continue; 
    if (v != null && v !== "") fd.append(k, v);
  }

  // agrega el fichero
  if (form.file) {
    fd.append("file", form.file);
  }

  const resp = await fetch(`${process.env.BACK_URL}/api/users/${userId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }, 
    body: fd
  });
  if (!resp.ok) throw new Error((await resp.json()).message);
  return (await resp.json()).user;
}
