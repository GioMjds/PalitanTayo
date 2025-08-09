
export type User = {
    id: string;
    name: string;
    username: string;
    profileImage: string;
    email: string;
    bio?: string;
    location?: string;
    items: Item[];
    swapsInitiated: Swap[];
    swapsReceived: Swap[];
    created_at: string;
    updated_at: string;
}

export type Item = {
    id: string;
    item_name: string;
    description: string;
    item_condition: string;
    quantity: number;
    photos: string[];
    location_radius?: number;
    created_at: string;
    userId: User[];
}

export type Swap = {
    id: string;
    status: string;
    created_at: string;
    updated_at: string;
}