'use client';

import { useQuery } from "@tanstack/react-query";
import { GET } from "@/utils/axios";
import Image from "next/image";
import Link from "next/link";
import { UserProfileResponse } from "@/types/response/UserProfile";

export default function ProfilePage({ userId }: { userId: string }) {
    const { data } = useQuery({
        queryKey: ["userDetails", userId],
        queryFn: async () => {
            const response = await GET<UserProfileResponse>({
                url: `/profile/${userId}`,
                config: {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            });
            return response;
        }
    });

    const user: UserProfileResponse | any = data;

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="card p-6 flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                            <Image
                                src={user.profileImage ?? ""}
                                alt={`${user.name}'s profile`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">{user.name}</h1>
                        <p className="text-text-secondary mb-2">@{user.username}</p>
                        {user.location && (
                            <p className="flex items-center text-text-secondary mb-4">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {user.location}
                            </p>
                        )}
                        {user.bio && (
                            <p className="text-center text-text-secondary mb-4">{user.bio}</p>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 lg:w-3/4">
                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-primary mb-6">User Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-text-secondary mb-2">Email</h3>
                                <p className="text-primary">{user.email}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-text-secondary mb-2">Member Since</h3>
                                <p className="text-primary">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-text-secondary mb-2">Items Listed</h3>
                                <p className="text-primary">{user.items?.length || 0}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-text-secondary mb-2">Swaps Activity</h3>
                                <p className="text-primary">
                                    {user.swapsInitiated.length + user.swapsReceived.length} total
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User's Items */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">Items for Swap</h2>
                    <Link href="/items/new" className="text-link">
                        + Add New Item
                    </Link>
                </div>
            </section>

            {/* Swap Activity */}
            <section>
                <h2 className="text-2xl font-bold text-primary mb-6">Swap Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Initiated Swaps */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">Initiated Swaps</h3>
                        {user.swapsInitiated.length > 0 ? (
                            <ul className="space-y-3">
                                {user.swapsInitiated.map((swap: any) => (
                                    <li key={swap.id} className="border-b border-accent-dark pb-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Swap #{swap.id.slice(0, 6)}</span>
                                            <span className={`badge ${swap.status === 'completed' ? 'bg-success' :
                                                    swap.status === 'pending' ? 'bg-warning' : 'bg-error'
                                                } text-white px-2 py-1 rounded-md text-xs`}>
                                                {swap.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary">
                                            {new Date(swap.created_at).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-text-secondary">No initiated swaps.</p>
                        )}
                    </div>

                    {/* Received Swaps */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">Received Swaps</h3>
                        {user.swapsReceived.length > 0 ? (
                            <ul className="space-y-3">
                                {user.swapsReceived.map((swap: any) => (
                                    <li key={swap.id} className="border-b border-accent-dark pb-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Swap #{swap.id.slice(0, 6)}</span>
                                            <span className={`badge ${swap.status === 'completed' ? 'bg-success' :
                                                    swap.status === 'pending' ? 'bg-warning' : 'bg-error'
                                                } text-white px-2 py-1 rounded-md text-xs`}>
                                                {swap.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary">
                                            {new Date(swap.created_at).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-text-secondary">No received swaps.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}