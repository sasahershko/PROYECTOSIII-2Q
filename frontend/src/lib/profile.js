// src/lib/profile.js
"use server";
import { cookies } from "next/headers";


export async function getProfile() {
  try {
    const token = cookies().get("token")?.value; 
    if (!token) {
      throw new Error("Token not found in cookies");
    }

    const response = await fetch(`${process.env.BACK_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}



