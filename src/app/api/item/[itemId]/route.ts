import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;

        const item = await prisma.item.findUnique({
            where: { id: itemId },
        });

        if (!item) {
            return NextResponse.json({
                error: "Item not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            id: item.id,
            item_name: item.item_name,
            description: item.description,
            photos: item.photos,
            item_condition: item.item_condition,
            quantity: item.quantity,
            location_radius: item.location_radius,
            created_at: item.created_at,
            userId: item.userId,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/item/[itemId] GET error: ${error}`
        }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const formData = await req.formData();
        const item_name = formData.get('item_name') as string;
        const description = formData.get('description') as string;
        const item_condition = formData.get('item_condition') as string;
        const quantity = parseInt(formData.get('quantity') as string);
        const photos = formData.getAll('photos') as File[];

        if (!item_name || isNaN(quantity)) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        const existingItem = await prisma.item.findUnique({
            where: { id: itemId },
        });

        if (!existingItem) {
            return NextResponse.json({
                error: "Item not found"
            }, { status: 404 });
        }

        if (existingItem.userId !== user.id) {
            return NextResponse.json({
                error: "You do not have permission to update this item"
            }, { status: 403 });
        }

        const newImageUrls: string[] = [];
        const imagesToDelete: string[] = [];

        for (const photo of photos) {
            if (photo.size > 0) {
                const arrayBuffer = await photo.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'palitan-tayo/items' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                });

                newImageUrls.push((uploadResult as any).secure_url);
            }
        }

        if (newImageUrls.length > 0) {
            for (const image of existingItem.photos) {
                const publicId = image.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`palitan-tayo/items/${publicId}`);
                    imagesToDelete.push(image);
                }
            }
        }

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                item_name: item_name,
                description: description,
                item_condition: item_condition,
                quantity: quantity,
                photos: newImageUrls,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profileImage: true,
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Item updated successfully",
            item: {
                id: updatedItem.id,
                item_name: updatedItem.item_name,
                description: updatedItem.description,
                item_condition: updatedItem.item_condition,
                quantity: updatedItem.quantity,
                photos: updatedItem.photos,
                userId: updatedItem.userId,
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/item/[itemId] PUT error: ${error}`
        }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;
        const user = await getCurrentUser();
        
        if (!user) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const itemToDelete = await prisma.item.findUnique({
            where: { id: itemId },
        });

        if (!itemToDelete) {
            return NextResponse.json({
                error: "Item not found"
            }, { status: 404 });
        }

        if (itemToDelete.userId !== user.id) {
            return NextResponse.json({
                error: "You do not have permission to delete this item"
            }, { status: 403 });
        }

        if (itemToDelete.photos && itemToDelete.photos.length > 0) {
            for (const imageUrl of itemToDelete.photos) {
                try {
                    const urlParts = imageUrl.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const publicId = `palitan-tayo/items/${fileName.split('.')[0]}`;
                    
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudinaryError) {
                    console.error(`Error deleting image from Cloudinary: ${cloudinaryError}`);
                    return NextResponse.json({
                        error: `Error deleting image from Cloudinary: ${cloudinaryError}`
                    }, { status: 500 });
                }
            }
        }

        await prisma.item.delete({
            where: { id: itemId },
        });

        return NextResponse.json({
            message: "Item deleted successfully"
        }, { status: 204 });
    } catch (error) {
        return NextResponse.json({
            error: `/api/item/[itemId] DELETE error: ${error}`
        }, { status: 500 });
    }
}