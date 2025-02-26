"use client";

// Función para obtener el token desde document.cookie
export function getTokenFromClient() {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [name, value] = cookie.split("=");
    acc[name] = value;
    return acc;
  }, {});

  return cookies.token || null;
}

// Función para obtener el rol decodificando el token en el cliente
export async function getUserRole() {
  try {
    const token = getTokenFromClient();
    if (!token) {
      return "guest";
    }

    // decodificamos el token en el frontend
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.rol || "guest";
  } catch (error) {
    console.error("Error en getUserRole:", error);
    return "guest";
  }
}
