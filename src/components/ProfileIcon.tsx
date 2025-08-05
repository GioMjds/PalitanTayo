'use client';

import Image from "next/image";
import { FC } from "react";

interface ProfileIconProps {
    profileImage?: string;
    onClick?: () => void;
}

const ProfileIcon: FC<ProfileIconProps> = ({ profileImage, onClick }) => {
    return (
        <div onClick={onClick} className="flex items-center cursor-pointer">
            <Image
                src={profileImage as string}
                alt="Profile"
                width={55}
                height={55}
                priority
                className="rounded-full object-cover"
            />
        </div>
    )
}

export default ProfileIcon;