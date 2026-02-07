import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const isSeller = await checkRole('seller');

    if (isSeller) {
        redirect("/dashboard/seller");
    }

    // Default to home for buyers (or buyer dashboard in future)
    redirect("/");
}
