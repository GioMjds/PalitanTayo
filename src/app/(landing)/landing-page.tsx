'use client';

import { GET } from "@/utils/axios"
import { useQuery } from "@tanstack/react-query"

export default function LandingPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['message'],
        queryFn: async () => {
            const response = await GET({
                url: '/message',
                config: {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            });
            return response.data;
        }
    });

    const message = data?.message || [];

    if (isLoading) {
        return <h1 className="text-3xl font-semibold">Loading...</h1>;
    }

    return (
        <h1 className="text-3xl font-semibold">
            {message}
        </h1>
    )
}