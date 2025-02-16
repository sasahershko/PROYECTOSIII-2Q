import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; //para validar tokens de autenticación

export async function middleware(req) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/login', req.url)); //redirigir a la página de login si no hay token
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); //convertir la clave secreta en un array de bytes (jwtVerify requiere un Uint8Array)
        const { payload } = await jwtVerify(token, secret); //verificar el token (si el token es modificado o expirado, lanza error)

        const userRole = payload.rol;

        // Si ya estás autenticado y en la página de login o registro, redirigir según el rol
        if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
            if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url)); //redirigir a la página de admin si el usuario es admin
            } else if (userRole === 'estudiante') {
                return NextResponse.redirect(new URL('/user', req.url)); //redirigir a la página de usuario si el usuario es estudiante
            }
        }

        //!ESTO ME DA ERROR AL MOMENTO DE ENTRAR A LA PÁGINA DE ADMIN O USER ASI QUE POR ESO DEBO HACER ESO
        //si ya estás en la página /admin, no hacer nada
        if (req.nextUrl.pathname.startsWith('/admin') && userRole === 'admin') {
            return NextResponse.next();
        }

        //si ya estás en la página /user, no hacer nada
        if (req.nextUrl.pathname.startsWith('/user') && userRole === 'estudiante') {
            return NextResponse.next();
        }

        //si estás en la página admin pero no eres admin, redirigir al inicio
        if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        //si estás en la página user pero no eres estudiante, redirigir al inicio
        if (req.nextUrl.pathname.startsWith("/user") && userRole !== "estudiante") {
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
    matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"], //middleware solo en rutas protegidas
};
