import {
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query";
import { GET } from "@/utils/axios";
import { notFound } from "next/navigation";
import ProfilePage from "./user-profile";
import { UserProfileResponse } from "@/types/response/UserProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await params;
        const userData = await GET<UserProfileResponse>({
            url: `/profile/${userId}`,
            config: {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        });

        if (!userData) {
            return {
                title: "Profile Not Found",
                description: "The profile you are looking for does not exist."
            }
        }

        return {
            title: userData ? `${userData.username}'s Profile - Palitan Tayo!` : "User Profile",
            description: `Profile page for ${userData.username}. View their trades, items, and more.`,
        }
    } catch (error) {
        return {
            title: "Profile Not Found",
            description: "The profile you are looking for does not exist."
        }
    }
}

async function getUserProfile(userId: string) {
    try {
        const userData = await GET({
            url: `/profile/${userId}`,
            config: {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        });
        return userData;
    } catch (error) {
        return null;
    }
}

export default async function Profile({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: ["userDetails", userId],
            queryFn: () => getUserProfile(userId),
        });
    } catch {
        notFound();
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfilePage userId={userId} />
        </HydrationBoundary>
    )
}