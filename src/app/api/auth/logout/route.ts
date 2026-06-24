import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("admin_token", "", { httpOnly: true, maxAge: 0 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
