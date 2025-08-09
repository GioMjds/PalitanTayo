import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const formData = await req.formData();

        const item_name = formData.get("item_name") as string;
        const description = formData.get("description") as string | null;
        const item_condition = formData.get("item_condition") as string | null;
        const swap_demand = formData.get("swap_demand") as string | null;
        const photos = formData.getAll("photos") as File[];
        const uploadedImageUrls: string[] = [];

        if (photos && photos.length > 0) {
            for (const photo of photos) {
                if (photo.size === 0) continue;

                const arrayBuffer = await photo.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "palitan-tayo/items",
                            resource_type: "image",
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });

                if (result && typeof result === "object" && "secure_url" in result) {
                    uploadedImageUrls.push(result.secure_url as string);
                }
            }
        }

        const newItem = await prisma.item.create({
            data: {
                id: crypto.randomUUID(),
                item_name: item_name,
                description: description,
                item_condition: item_condition,
                swap_demand: swap_demand,
                userId: user.id,
            },
            include: {
                images: true,
            }
        });

        const imagePromises = uploadedImageUrls.map(url => 
            prisma.itemImage.create({
                data: {
                    id: crypto.randomUUID(),
                    url: url,
                    itemId: newItem.id,
                }
            })
        );

        const itemImages = await Promise.all(imagePromises);

        return NextResponse.json({
            message: "Item added successfully",
            item: {
                id: newItem.id,
                userId: newItem.userId,
                item_name: newItem.item_name,
                description: newItem.description,
                item_condition: newItem.item_condition,
                swap_demand: newItem.swap_demand,
                photos: itemImages.map(image => image.url),
                created_at: newItem.created_at,
                updated_at: newItem.updated_at,
            }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/item POST failed: ${error}`
        }, { status: 500 })
    }
}