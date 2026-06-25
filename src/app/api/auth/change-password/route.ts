import { NextResponse } from "next/server";
import { getCurrentAdmin, badRequest, unauthorized, success } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return unauthorized();

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return badRequest("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      return badRequest("New password must be at least 6 characters");
    }

    if (currentPassword !== "123456") {
      return badRequest("Current password is incorrect");
    }

    return success({
      success: true,
      message: "Password changed successfully. In a production environment, this would update the database.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
