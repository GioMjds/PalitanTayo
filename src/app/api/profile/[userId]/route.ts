import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                items: {
                    select: {
                        id: true,
                        item_name: true,
                        description: true,
                        photos: true,
                        item_condition: true,
                        quantity: true,
                        location_radius: true,
                        created_at: true
                    }
                },
                swapsInitiated: {
                    select: {
                        id: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                    }
                },
                swapsReceived: {
                    select: {
                        id: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                    }
                },
            }
        });

        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            bio: user.bio,
            username: user.username,
            email: user.email,
            location: user.location,
            profileImage: user.profileImage,
            items: user.items,
            swapsInitiated: user.swapsInitiated,
            swapsReceived: user.swapsReceived,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `Failed to fetch user profile: ${error}`
        }, { status: 500 })
    }
}