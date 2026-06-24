import { NextResponse } from "next/server";

const placeholderProducts = [
  { id: "cc-001", name: "Classic Chocolate Chip Cookie", slug: "classic-chocolate-chip", sku: "CC-001", description: "Our signature classic chocolate chip cookie baked to golden perfection.", ingredients: null, nutritionInfo: null, price: 199, discountPrice: null, stockQuantity: 50, images: [], categoryId: "cat-1", category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null }, isFeatured: true, isBestSeller: true, isActive: true, rating: 4.8, reviewCount: 124, seoTitle: null, seoDescription: null, createdAt: "2025-01-15", updatedAt: "2025-06-01" },
  { id: "od-002", name: "Oreo Delight Cookie", slug: "oreo-delight", sku: "OD-002", description: "A crunchy, creamy explosion of Oreo goodness in every cookie.", ingredients: null, nutritionInfo: null, price: 249, discountPrice: 199, stockQuantity: 35, images: [], categoryId: "cat-2", category: { id: "cat-2", name: "Oreo", slug: "oreo", image: null }, isFeatured: true, isBestSeller: true, isActive: true, rating: 4.9, reviewCount: 98, seoTitle: null, seoDescription: null, createdAt: "2025-02-10", updatedAt: "2025-06-01" },
  { id: "rv-003", name: "Red Velvet Cookie", slug: "red-velvet", sku: "RV-003", description: "A stunning red velvet cookie with a soft, chewy texture.", ingredients: null, nutritionInfo: null, price: 229, discountPrice: null, stockQuantity: 40, images: [], categoryId: "cat-3", category: { id: "cat-3", name: "Red Velvet", slug: "red-velvet", image: null }, isFeatured: true, isBestSeller: true, isActive: true, rating: 4.7, reviewCount: 87, seoTitle: null, seoDescription: null, createdAt: "2025-01-20", updatedAt: "2025-06-01" },
  { id: "gb-004", name: "Golden Butter Cookie", slug: "golden-butter", sku: "GB-004", description: "A melt-in-your-mouth buttery cookie.", ingredients: null, nutritionInfo: null, price: 179, discountPrice: null, stockQuantity: 60, images: [], categoryId: "cat-4", category: { id: "cat-4", name: "Butter", slug: "butter", image: null }, isFeatured: false, isBestSeller: true, isActive: true, rating: 4.6, reviewCount: 65, seoTitle: null, seoDescription: null, createdAt: "2025-03-05", updatedAt: "2025-06-01" },
  { id: "dc-005", name: "Double Chocolate Fudge Cookie", slug: "double-chocolate-fudge", sku: "DC-005", description: "For the ultimate chocolate lover.", ingredients: null, nutritionInfo: null, price: 259, discountPrice: null, stockQuantity: 30, images: [], categoryId: "cat-1", category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null }, isFeatured: true, isBestSeller: true, isActive: true, rating: 4.9, reviewCount: 112, seoTitle: null, seoDescription: null, createdAt: "2025-02-14", updatedAt: "2025-06-01" },
  { id: "mb-006", name: "Signature Mixed Box", slug: "signature-mixed-box", sku: "MB-006", description: "Our best-selling assortment.", ingredients: null, nutritionInfo: null, price: 599, discountPrice: 549, stockQuantity: 25, images: [], categoryId: "cat-5", category: { id: "cat-5", name: "Mixed Boxes", slug: "mixed-boxes", image: null }, isFeatured: true, isBestSeller: true, isActive: true, rating: 4.8, reviewCount: 203, seoTitle: null, seoDescription: null, createdAt: "2025-01-10", updatedAt: "2025-06-01" },
  { id: "sc-007", name: "Salted Caramel Crunch", slug: "salted-caramel-crunch", sku: "SC-007", description: "Sweet and salty perfection.", ingredients: null, nutritionInfo: null, price: 219, discountPrice: null, stockQuantity: 45, images: [], categoryId: "cat-4", category: { id: "cat-4", name: "Butter", slug: "butter", image: null }, isFeatured: false, isBestSeller: false, isActive: true, rating: 4.5, reviewCount: 42, seoTitle: null, seoDescription: null, createdAt: "2025-04-01", updatedAt: "2025-06-01" },
  { id: "pb-008", name: "Peanut Butter Bliss", slug: "peanut-butter-bliss", sku: "PB-008", description: "Rich and nutty peanut butter cookie.", ingredients: null, nutritionInfo: null, price: 209, discountPrice: 179, stockQuantity: 38, images: [], categoryId: "cat-1", category: { id: "cat-1", name: "Chocolate", slug: "chocolate", image: null }, isFeatured: false, isBestSeller: false, isActive: true, rating: 4.4, reviewCount: 33, seoTitle: null, seoDescription: null, createdAt: "2025-03-20", updatedAt: "2025-06-01" },
  { id: "wc-009", name: "White Chocolate Macadamia", slug: "white-chocolate-macadamia", sku: "WC-009", description: "A luxuriously soft cookie.", ingredients: null, nutritionInfo: null, price: 269, discountPrice: null, stockQuantity: 28, images: [], categoryId: "cat-4", category: { id: "cat-4", name: "Butter", slug: "butter", image: null }, isFeatured: false, isBestSeller: false, isActive: true, rating: 4.7, reviewCount: 56, seoTitle: null, seoDescription: null, createdAt: "2025-02-28", updatedAt: "2025-06-01" },
  { id: "ob-010", name: "Oreo Birthday Blast", slug: "oreo-birthday-blast", sku: "OB-010", description: "Celebration-worthy cookie.", ingredients: null, nutritionInfo: null, price: 259, discountPrice: 219, stockQuantity: 20, images: [], categoryId: "cat-2", category: { id: "cat-2", name: "Oreo", slug: "oreo", image: null }, isFeatured: false, isBestSeller: false, isActive: true, rating: 4.6, reviewCount: 28, seoTitle: null, seoDescription: null, createdAt: "2025-05-01", updatedAt: "2025-06-01" },
  { id: "rv-011", name: "Red Velvet Cheesecake", slug: "red-velvet-cheesecake", sku: "RV-011", description: "The best of both worlds.", ingredients: null, nutritionInfo: null, price: 289, discountPrice: null, stockQuantity: 25, images: [], categoryId: "cat-3", category: { id: "cat-3", name: "Red Velvet", slug: "red-velvet", image: null }, isFeatured: false, isBestSeller: false, isActive: true, rating: 4.8, reviewCount: 49, seoTitle: null, seoDescription: null, createdAt: "2025-04-15", updatedAt: "2025-06-01" },
  { id: "gx-012", name: "Gourmet Gift Box", slug: "gourmet-gift-box", sku: "GX-012", description: "Our premium gift box.", ingredients: null, nutritionInfo: null, price: 1199, discountPrice: 999, stockQuantity: 15, images: [], categoryId: "cat-5", category: { id: "cat-5", name: "Mixed Boxes", slug: "mixed-boxes", image: null }, isFeatured: true, isBestSeller: false, isActive: true, rating: 4.9, reviewCount: 78, seoTitle: null, seoDescription: null, createdAt: "2025-01-05", updatedAt: "2025-06-01" },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = placeholderProducts.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
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
    const index = placeholderProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const updatedProduct = { ...placeholderProducts[index], ...body, id, updatedAt: new Date().toISOString() };

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
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
    const index = placeholderProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
