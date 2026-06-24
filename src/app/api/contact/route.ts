import { NextResponse } from "next/server";
import { badRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return badRequest("Name, email, and message are required");
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We will get back to you shortly.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
