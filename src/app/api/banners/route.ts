import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const position = searchParams.get("position");

    const where = position ? { position } : {};
    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, banners });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image || "/images/banner.png",
        link: body.link || null,
        position: body.position || "hero",
        isActive: body.isActive ?? true,
        order: body.order || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
      banner,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
