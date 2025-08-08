import { Metadata } from "next";
import AddItemPage from "./add-item";

export const metadata: Metadata = {
    title: "Add Item to Your Profile",
    description: "Add a new item to your profile for barter.",
}

export const dynamic = "force-dynamic";

export default function AddItem() {
    return <AddItemPage />
}