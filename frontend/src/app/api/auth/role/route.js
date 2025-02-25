// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// //esto es porque no se puede llamar directamente a cookies en un componente cliente, entonces se llama a api para realizarlo
// export async function GET() {
//   try {
//     const cookieStore = await cookies(); 
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return Response.json({ rol: "guest" }, { status: 200 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('DECODED: ', decoded);
//     return Response.json({ rol: decoded.rol || "guest" }, { status: 200 });

//   } catch (error) {
//     return Response.json({ rol: "guest"}, { status: 401 });
//   }
// }
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    console.log("📢 Intentando obtener el rol desde la API...");

    // 🔥 EXTRAER COOKIE MANUALMENTE
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );
    const token = cookies.token;

    if (!token) {
      console.log("📢 No hay token en cookies, devolviendo guest");
      return NextResponse.json({ rol: "guest" }, { status: 200 });
    }

    // 🔥 DECODIFICAR EL TOKEN
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    console.log("✅ Token válido, rol:", decoded.rol);

    return NextResponse.json({ rol: decoded.rol }, { status: 200 });

  } catch (error) {
    console.error("❌ Error en la verificación del token:", error);
    return NextResponse.json({ rol: "guest" }, { status: 401 });
  }
}
