import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const protectedRoutes = ['/'];
    const authRoutes = ['/login', '/register', '/forgot', '/verify'];
    const accessToken = req.cookies.get('access_token')?.value;
    const cookiesToDelete = ['access_token', 'refresh_token'];

    let isAuthenticated = false;

    if (accessToken) {
        try {
            await jwtVerify(accessToken, encodedKey);
            isAuthenticated = true;
        } catch (error) {
            const response = NextResponse.redirect(new URL('/login', req.url));
            for (const cookie of cookiesToDelete) {
                response.cookies.delete(cookie);
            }
            return response;
        }
    }

    if (isAuthenticated && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    
    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ]
}