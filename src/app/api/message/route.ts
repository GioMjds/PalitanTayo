import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({
            message: "Hello, world!"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}