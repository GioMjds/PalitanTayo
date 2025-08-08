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
        const quantity = parseInt(formData.get("quantity") as string);
        const photos = formData.getAll("photos") as File[];
        const uploadedImageUrls: string[] = [];
        
        if (!item_name || isNaN(quantity)) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

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
                quantity: quantity,
                photos: uploadedImageUrls,
                userId: user.id,
            }
        });

        return NextResponse.json({
            message: "Item added successfully",
            item: {
                id: newItem.id,
                item_name: newItem.item_name,
                description: newItem.description,
                item_condition: newItem.item_condition,
                quantity: newItem.quantity,
                photos: newItem.photos,
                userId: newItem.userId,
            }
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/item POST failed: ${error}`
        }, { status: 500 })
    }
}