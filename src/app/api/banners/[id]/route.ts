import { NextResponse } from "next/server";

const placeholderBanners = [
  { id: "ban-001", title: "Festive Special - Up to 20% Off", subtitle: "Celebrate with our handcrafted gourmet cookies", image: "/images/banners/festive.jpg", link: "/shop", position: "hero", isActive: true, order: 1 },
  { id: "ban-002", title: "New: Red Velvet Cheesecake", subtitle: "The best of both worlds in every bite", image: "/images/banners/red-velvet.jpg", link: "/shop", position: "hero", isActive: true, order: 2 },
  { id: "ban-003", title: "Corporate Gifting", subtitle: "Impress your clients with premium gift boxes", image: "/images/banners/gifting.jpg", link: "/shop?category=mixed-boxes", position: "sidebar", isActive: true, order: 1 },
  { id: "ban-004", title: "Free Shipping on Orders ₹399+", subtitle: null, image: "/images/banners/free-shipping.jpg", link: null, position: "promo", isActive: false, order: 1 },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = placeholderBanners.find((b) => b.id === id);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, banner });
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
    const index = placeholderBanners.findIndex((b) => b.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const body = await request.json();
    const updatedBanner = { ...placeholderBanners[index], ...body, id };

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      banner: updatedBanner,
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
    const index = placeholderBanners.findIndex((b) => b.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
