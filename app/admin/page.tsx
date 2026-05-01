import { redirect } from "next/navigation";
import { getSessionPayload } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminEntryPage() {
  const session = await getSessionPayload();

  if (session?.role === "ADMIN") {
    redirect("/dashboard");
  }

  redirect("/auth/login");
}
