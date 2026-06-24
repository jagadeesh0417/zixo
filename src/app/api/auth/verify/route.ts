import { NextResponse } from "next/server";
import { getAuthToken, verifyToken, unauthorized } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) return unauthorized();

    const admin = verifyToken(token);
    if (!admin) return unauthorized();

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, name: "Admin", email: admin.email, role: admin.role, isFirstLogin: false },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
