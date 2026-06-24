import { NextResponse } from "next/server";
import { badRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return badRequest("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return badRequest("Invalid email address");
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
