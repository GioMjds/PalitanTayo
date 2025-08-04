import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export default function middleware(req: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ]
}