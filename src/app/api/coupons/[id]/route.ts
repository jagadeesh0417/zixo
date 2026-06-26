import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    const body = await request.json();
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: body.code?.toUpperCase(),
        description: body.description,
        type: body.type,
        value: body.value !== undefined ? parseFloat(body.value) : undefined,
        minOrder: body.minOrder !== undefined ? (body.minOrder ? parseFloat(body.minOrder) : null) : undefined,
        maxDiscount: body.maxDiscount !== undefined ? (body.maxDiscount ? parseFloat(body.maxDiscount) : null) : undefined,
        usageLimit: body.usageLimit !== undefined ? (body.usageLimit ? parseInt(body.usageLimit) : null) : undefined,
        isActive: body.isActive,
        expiresAt: body.expiresAt !== undefined ? (body.expiresAt ? new Date(body.expiresAt) : null) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
