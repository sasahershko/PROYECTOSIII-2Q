import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; //para validar tokens de autenticación

export async function middleware(req, res) {
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

        // return NextResponse.json({
        //     mensaje: "✅ Middleware ejecutado correctamente",
        //     userRole: userRole,
        //     tokenPayload: payload
        // });

        //si el acceso a login y registro si ya estás autenticado
        if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')) {
            if (userRole === 'admin') {
                return NextResponse.redirect(new URL('/admin', req.url)); //redirigir a la página de admin si el usuario es admin
            } else if (userRole === 'estudiante') {
                return NextResponse.redirect(new URL('/user', req.url)); //redirigir a la página de usuario si el usuario es user
            }
        }

        if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
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
    matcher: ["/admin/:path*", "/user/:path*", "/login", "/register"], // Middleware solo en rutas protegidas
};

