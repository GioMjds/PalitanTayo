import { Metadata } from "next";
import { 
    dehydrate,
    HydrationBoundary,
    QueryClient 
} from "@tanstack/react-query";
import { GET } from "@/utils/axios";
import ItemDetailsPage from "./item-details";
import { notFound } from "next/navigation";
import type { Item } from "@/types/response/ItemDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ itemId: string }> }): Promise<Metadata> {
    try {
        const { itemId } = await params;
        const itemDetails = await GET<Item>({
            url: `/item/${itemId}`,
            config: {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        });

        if (!itemDetails) {
            return {
                title: "Item Not Found",
                description: "The item you are looking for does not exist."
            }
        }

        return {
            title: itemDetails ? `${itemDetails.item_name} - Palitan Tayo!` : "Item Details",
            description: `Details for item ${itemDetails.item_name}. View its description, condition, and more.`,
        }
    } catch (error) {
        return {
            title: "Item Not Found",
            description: "The item you are looking for does not exist."
        }
    }
}

async function getItemDetails(itemId: string) {
    try {
        const itemData = await GET({
            url: `/item/${itemId}`,
            config: {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        });
        return itemData;
    } catch (error) {
        return null;
    }
}

export default async function Item({ params }: { params: Promise<{ itemId: string }> }) {
    const { itemId } = await params;
    const queryClient = new QueryClient();
    
    try {
        await queryClient.prefetchQuery({
            queryKey: ["itemDetails", itemId],
            queryFn: () => getItemDetails(itemId)
        });
    } catch (error) {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ItemDetailsPage itemId={itemId} />
        </HydrationBoundary>
    );
}