import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const type = searchParams.get("type");

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                users: [],
                items: [],
                swap_demands: [],
                message: "Query must be at least 2 characters long"
            }, { status: 400 });
        }

        const searchTerm = query.trim();
        let results: any = {
            users: [],
            items: [],
            demands: []
        }

        if (!type || type === 'users' || type === 'all') {
            results.users = await prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { username: { contains: searchTerm, mode: 'insensitive' } },
                        { location: { contains: searchTerm, mode: 'insensitive' } },
                        { bio: { contains: searchTerm, mode: 'insensitive' } },
                    ]
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    location: true,
                    profileImage: true,
                    bio: true,
                    _count: {
                        select: {
                            items: true
                        }
                    }
                },
                take: 10
            });
        }

        if (!type || type === "items" || type === "all") {
            results.items = await prisma.item.findMany({
                where: {
                    OR: [
                        { item_name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                        { item_condition: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    },
                    images: {
                        select: {
                            url: true
                        },
                        take: 1
                    }
                },
                take: 10
            });
        }

        if (!type || type === 'demands' || type === 'all') {
            results.demands = await prisma.item.findMany({
                where: {
                    swap_demand: { 
                        contains: searchTerm, 
                        mode: 'insensitive',
                        not: null
                    }
                },
                select: {
                    id: true,
                    item_name: true,
                    swap_demand: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    },
                    images: {
                        select: {
                            url: true
                        },
                        take: 1
                    }
                },
                take: 10
            });
        }

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: `/api/search GET error: ${error}`
        }, { status: 500 });
    }
}