import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionsCredencial";
import type { Session } from "next-auth";

export async function getSessionUser(): Promise<Session["user"] | null> {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}
