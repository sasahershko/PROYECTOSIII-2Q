"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme) {
  const cookieStore = await cookies();
  cookieStore.set("theme", theme, {
    path: "/",
    // Cuando muere la cookie, el maximos son 180 dias:
    maxAge: 99999999999999,
  });
}
