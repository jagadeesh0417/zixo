import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "zixo-cookies-super-secret-key-2024";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value || null;
}

export async function getCurrentAdmin() {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function success(data: any, status = 200) {
  return NextResponse.json(data, { status });
}
