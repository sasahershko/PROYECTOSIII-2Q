import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; //para validar tokens de autenticación

export async function middleware(req) {


    // const token = req.cookies.get('token')?.value; -> ESTE NO ME FUNCIONA
    //lo saco manualmente desde la cabecera
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
    const token = cookies.token;

    //si no hay token y no está en login o register, redirigir a login
    if (!token) {
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
            return NextResponse.next(); // Permitir acceso sin token
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }


    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); //convertir la clave secreta en un array de bytes (jwtVerify requiere un Uint8Array)
        const { payload } = await jwtVerify(token, secret); //verificar el token (si el token es modificado o expirado, lanza error)

        const userRole = payload.rol;

        //si ya estás autenticado y en la página de login o register, redirigir según el rol
        if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
            if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            if (userRole === 'user') {
                return NextResponse.redirect(new URL('/user', req.url));
            }
            return NextResponse.next();
        }
        


        //si ya estás en la página /admin y eres admin, no hacer nada
        if (req.nextUrl.pathname.startsWith('/admin') && userRole === 'admin') {
            return NextResponse.next();
        }

        //si ya estás en la página /user y eres user, no hacer nada
        if (req.nextUrl.pathname.startsWith('/user') && userRole === 'user') {
            return NextResponse.next();
        }

        //si estás en la página admin pero no eres admin, redirigir al inicio
        if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        //si estás en la página user pero no eres estudiante, redirigir al inicio
        if (req.nextUrl.pathname.startsWith("/user") && userRole !== "user") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        //si todo está correcto
        return NextResponse.next();
    } catch (error) {
        console.error('token inválido o expirado:', error);
        return NextResponse.redirect(new URL('/login', req.url)); //redirigir a login si el token es inválido o expiró
    }
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"], //middleware solo en rutas protegidas
};
