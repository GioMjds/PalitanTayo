export type ItemResponse = {
	id: string;
	title: string;
	description: string | null;
	photos: string[];
	item_condition: string | null;
	quantity: number;
	location_radius: number | null;
	created_at: string; // ISO string
};

export type SwapResponse = {
	id: string;
	status:
		| 'PROPOSED'
		| 'COUNTERED'
		| 'WITHDRAWN'
		| 'REJECTED'
		| 'ACCEPTED'
		| 'IN_PROGRESS'
		| 'COMPLETED';
	created_at: string;
	updated_at: string;
};

export type UserProfileResponse = {
	id: string;
	name: string;
	bio: string | null;
	username: string;
	email: string;
	location: string | null;
	profileImage: string | null;
	createdAt: string;
	items: ItemResponse[];
	swapsInitiated: SwapResponse[];
	swapsReceived: SwapResponse[];
};

export type ErrorResponse = {
	error: string;
};
