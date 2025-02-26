"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/authClient";

export default function useUserRole() {
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const role = await getUserRole();
        setUserRole(role);
      } catch (error) {
        console.error("Error obteniendo el rol en cliente", error);
      }
    }

    fetchUserRole();
  }, []);

  return userRole;
}
