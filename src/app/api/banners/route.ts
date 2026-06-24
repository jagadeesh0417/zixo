import { NextRequest, NextResponse } from "next/server";

const placeholderBanners = [
  { id: "ban-001", title: "Festive Special - Up to 20% Off", subtitle: "Celebrate with our handcrafted gourmet cookies", image: "/images/banners/festive.jpg", link: "/shop", position: "hero", isActive: true, order: 1 },
  { id: "ban-002", title: "New: Red Velvet Cheesecake", subtitle: "The best of both worlds in every bite", image: "/images/banners/red-velvet.jpg", link: "/shop", position: "hero", isActive: true, order: 2 },
  { id: "ban-003", title: "Corporate Gifting", subtitle: "Impress your clients with premium gift boxes", image: "/images/banners/gifting.jpg", link: "/shop?category=mixed-boxes", position: "sidebar", isActive: true, order: 1 },
  { id: "ban-004", title: "Free Shipping on Orders ₹399+", subtitle: null, image: "/images/banners/free-shipping.jpg", link: null, position: "promo", isActive: false, order: 1 },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const position = searchParams.get("position");

    let filtered = [...placeholderBanners];

    if (position) {
      filtered = filtered.filter((b) => b.position === position);
    }

    return NextResponse.json({ success: true, banners: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBanner = {
      id: `ban-${Date.now()}`,
      ...body,
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
      banner: newBanner,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
