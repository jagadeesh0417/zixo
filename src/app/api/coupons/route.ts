import { NextRequest, NextResponse } from "next/server";

const placeholderCoupons = [
  { id: "coup-001", code: "WELCOME10", description: "10% off on your first order", type: "PERCENTAGE", value: 10, minOrder: 299, maxDiscount: 100, usageLimit: 100, usedCount: 45, isActive: true, expiresAt: "2025-12-31T23:59:59Z" },
  { id: "coup-002", code: "COOKIE50", description: "Flat ₹50 off on orders above ₹499", type: "FLAT", value: 50, minOrder: 499, maxDiscount: null, usageLimit: 200, usedCount: 78, isActive: true, expiresAt: "2025-12-31T23:59:59Z" },
  { id: "coup-003", code: "FREESHIP", description: "Free shipping on orders above ₹399", type: "FREE_SHIPPING", value: 0, minOrder: 399, maxDiscount: null, usageLimit: 150, usedCount: 120, isActive: true, expiresAt: "2025-12-31T23:59:59Z" },
  { id: "coup-004", code: "FESTIVE20", description: "20% off festive special", type: "PERCENTAGE", value: 20, minOrder: 599, maxDiscount: 200, usageLimit: 50, usedCount: 50, isActive: false, expiresAt: "2025-06-01T23:59:59Z" },
  { id: "coup-005", code: "TRYNEW", description: "15% off on new arrivals", type: "PERCENTAGE", value: 15, minOrder: 0, maxDiscount: 150, usageLimit: 300, usedCount: 12, isActive: true, expiresAt: "2025-10-31T23:59:59Z" },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.toLowerCase();

    let filtered = [...placeholderCoupons];

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.code.toLowerCase().includes(search) ||
          (c.description && c.description.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, coupons: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCoupon = {
      id: `coup-${Date.now()}`,
      ...body,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      coupon: newCoupon,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
