import {
    dehydrate,
    QueryClient,
    HydrationBoundary
} from '@tanstack/react-query';
import { use } from 'react';
import { GET } from '@/utils/axios';
import LandingPage from './landing-page';

async function getMessage() {
    const response = await GET({
        url: '/message',
        config: {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    });
    return response.data;
}

export default function Page() {
    const queryClient = new QueryClient();

    use(queryClient.prefetchQuery({
        queryKey: ['message'],
        queryFn: getMessage
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LandingPage />
        </HydrationBoundary>
    );
}