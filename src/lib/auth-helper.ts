import { auth } from "./auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getRequiredSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { session, response: null };
}
