import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; //para validar tokens de autenticación

export async function middleware(req, res) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url)); //redirigir a la página de login si no hay token
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); //convertir la clave secreta en un array de bytes (jwtVerify requiere un Uint8Array)
        const {payload} = await jwtVerify(token, secret); //verificar el token (si el token es modificado o expirado, lanza error)

        const userRole = payload.role;
        console.log("Token verificado, payload:", payload);
        console.log("Rol del usuario:", userRole);


        if(req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url)); //redirigir a la página de login si el usuario no es admin
        }

        if (req.nextUrl.pathname.startsWith("/user") && userRole !== "user") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        //si todo está correcto
        return NextResponse.next();

    } catch (error) {
        console.error('Token inválido o expirado:', error);
        return NextResponse.redirect(new URL('/login', req.url))
    }

}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"], // Middleware solo en rutas protegidas
  };
