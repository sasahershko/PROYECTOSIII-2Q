"use server";

// Función para login
export const loginUser = async (formData) => {
  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const responseData = await res.json();
      throw new Error(responseData.mensaje);
    }

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Función para register
export const registerUser = async (formData) => {
  try {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const responseData = await res.json();
      throw new Error(responseData.mensaje);
    }

    const responseData = await res.json();
    return responseData;
  } catch (error) {
    throw new Error(error.message);
  }
};
