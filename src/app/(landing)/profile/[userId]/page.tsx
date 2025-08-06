import { 
    dehydrate,
    HydrationBoundary,
    QueryClient
} from "@tanstack/react-query"
import { Metadata } from "next";
import { use } from "react";
import ProfilePage from "./user-profile";

export const metadata: Metadata = {
    title: "My Profile"
}

export const dynamic = "force-dynamic";

export default function Profile() {
    const queryClient = new QueryClient();
    
    use(queryClient.prefetchQuery({
        queryKey: ["userDetails"],
        queryFn: async () => {
            const response = await fetch("/api/userDetails");
            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }
            return response.json();
        }
    }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfilePage />
        </HydrationBoundary>
    )
}