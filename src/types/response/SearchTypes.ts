export interface SearchUser {
    id: string;
    name: string;
    username: string;
    location: string | null;
    profileImage: string | null;
    bio: string | null;
    _count: {
        items: number;
    };
}

export interface SearchItem {
    id: string;
    item_name: string;
    description: string | null;
    item_condition: string | null;
    user: {
        id: string;
        name: string;
        username: string;
        profileImage: string | null;
    };
    images: {
        url: string;
    }[];
}

export interface SearchDemand {
    id: string;
    item_name: string;
    swap_demand: string;
    user: {
        id: string;
        name: string;
        username: string;
        profileImage: string | null;
    };
    images: {
        url: string;
    }[];
}

export interface SearchResults {
    users: SearchUser[];
    items: SearchItem[];
    demands: SearchDemand[];
    message?: string;
}