import { NextResponse } from "next/server";
import { generateToken, badRequest, unauthorized } from "@/lib/auth";

const ADMIN_CREDENTIALS = {
  email: "admin@zixocookies.com",
  password: "Admin@123",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return badRequest("Email and password are required");
    }

    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: "1", email, role: "SUPER_ADMIN" });

    const response = NextResponse.json({
      success: true,
      admin: { id: "1", name: "Admin", email, role: "SUPER_ADMIN", isFirstLogin: false },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
