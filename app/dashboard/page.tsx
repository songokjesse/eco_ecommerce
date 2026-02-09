import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const isSeller = await checkRole('seller');

    // Check if they have a shop in DB (in case role is not yet synced in token)
    const shop = await prisma.shop.findUnique({
        where: { ownerId: userId },
    });

    if (isSeller || shop) {
        redirect("/dashboard/seller");
    }

    // Redirect buyers to buyer dashboard
    redirect("/dashboard/buyer");
}
