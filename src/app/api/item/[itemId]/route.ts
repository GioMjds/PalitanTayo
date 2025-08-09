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
            include: { images: true }
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
            photos: item.images.map(image => image.url),
            item_condition: item.item_condition,
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
        const swap_demand = formData.get('swap_demand') as string;
        const photos = formData.getAll('photos') as File[];

        if (!item_name) {
            return NextResponse.json({
                error: "Missing required fields"
            }, { status: 400 });
        }

        const existingItem = await prisma.item.findUnique({
            where: { id: itemId },
            include: {
                images: true
            }
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

        if (photos && photos.length > 0 && photos[0].size > 0) {
            for (const image of existingItem.images) {
                try {
                    const urlParts = image.url.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const publicId = `palitan-tayo/items/${fileName.split('.')[0]}`;
                    
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudinaryError) {
                    console.error(`Error deleting image from Cloudinary: ${cloudinaryError}`);
                }
            }

            await prisma.itemImage.deleteMany({
                where: {
                    itemId: itemId
                }
            });

            for (const photo of photos) {
                if (photo.size === 0) continue;

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

            await Promise.all(
                newImageUrls.map(url => 
                    prisma.itemImage.create({
                        data: {
                            id: crypto.randomUUID(),
                            url: url,
                            itemId: itemId
                        }
                    })
                )
            );
        }

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                item_name: item_name,
                description: description,
                item_condition: item_condition,
                swap_demand: swap_demand,
            },
            include: {
                images: true,
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
                swap_demand: updatedItem.swap_demand,
                photos: updatedItem.images.map(img => img.url),
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
            include: { images: true }
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

        if (itemToDelete.images && itemToDelete.images.length > 0) {
            for (const image of itemToDelete.images) {
                try {
                    const urlParts = image.url.split('/');
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