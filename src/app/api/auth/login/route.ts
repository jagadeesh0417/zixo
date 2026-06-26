import { NextResponse } from "next/server";
import { generateToken, badRequest } from "@/lib/auth";

const ADMIN_CREDENTIALS = {
  username: "zixocookies@gmail.com",
  password: "123456",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return badRequest("Username and password are required");
    }

    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: "1", username, role: "SUPER_ADMIN" });

    const response = NextResponse.json({
      success: true,
      token,
      admin: { id: "1", name: "Admin", username, role: "SUPER_ADMIN", isFirstLogin: false },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
