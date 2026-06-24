import { NextResponse } from "next/server";
import { badRequest } from "@/lib/auth";

const placeholderCoupons = [
  { id: "coup-001", code: "WELCOME10", description: "10% off on your first order", type: "PERCENTAGE", value: 10, minOrder: 299, maxDiscount: 100, usageLimit: 100, usedCount: 45, isActive: true, expiresAt: "2025-12-31T23:59:59Z" },
  { id: "coup-002", code: "COOKIE50", description: "Flat ₹50 off on orders above ₹499", type: "FLAT", value: 50, minOrder: 499, maxDiscount: null, usageLimit: 200, usedCount: 78, isActive: true, expiresAt: "2025-12-31T23:59:59Z" },
  { id: "coup-003", code: "FREESHIP", description: "Free shipping on orders above ₹399", type: "FREE_SHIPPING", value: 0, minOrder: 399, maxDiscount: null, usageLimit: 150, usedCount: 120, isActive: true, expiresAt: "2025-12-31T23:59:59Z" },
  { id: "coup-004", code: "FESTIVE20", description: "20% off festive special", type: "PERCENTAGE", value: 20, minOrder: 599, maxDiscount: 200, usageLimit: 50, usedCount: 50, isActive: false, expiresAt: "2025-06-01T23:59:59Z" },
  { id: "coup-005", code: "TRYNEW", description: "15% off on new arrivals", type: "PERCENTAGE", value: 15, minOrder: 0, maxDiscount: 150, usageLimit: 300, usedCount: 12, isActive: true, expiresAt: "2025-10-31T23:59:59Z" },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;

    if (!code) {
      return badRequest("Coupon code is required");
    }

    const coupon = placeholderCoupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code", valid: false }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active", valid: false }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired", valid: false }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit", valid: false }, { status: 400 });
    }

    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json({
        error: `Minimum order amount of ₹${coupon.minOrder} required`,
        valid: false,
        minOrder: coupon.minOrder,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round((orderTotal * coupon.value) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === "FLAT") {
      discountAmount = coupon.value;
    } else if (coupon.type === "FREE_SHIPPING") {
      discountAmount = 0;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
