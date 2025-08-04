import { use } from "react"
import { GET } from "@/utils/axios"

async function fetchMessage() {
    const response = await GET<any>({
        url: '/message',
        config: {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    });
    console.log(response.data);
    return response.data;
}

export default function Page() {
    const { message } = use(fetchMessage());

    return (
        <h1 className="text-3xl font-semibold">{message}</h1>
    )
}