"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme) {
  cookies().set("theme", theme, {
    path: "/",
    // Cuando muere la cookie, el maximos son 180 dias:
    maxAge: 99999999999999,
  });
}
