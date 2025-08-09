import { NextResponse, type NextRequest } from "next/server";
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
                    include: {
                        images: true,
                    },
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

        const transformedItems = user.items?.map(item => ({
            id: item.id,
            item_name: item.item_name,
            description: item.description,
            item_condition: item.item_condition,
            swap_demand: item.swap_demand,
            photos: item.images?.map(image => image.url) || [],
            created_at: item.created_at,
            updated_at: item.updated_at,
            userId: item.userId,
        })) || [];

        return NextResponse.json({
            id: user.id,
            name: user.name,
            bio: user.bio,
            username: user.username,
            email: user.email,
            location: user.location,
            profileImage: user.profileImage,
            items: transformedItems,
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