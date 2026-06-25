import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const where: Record<string, unknown> = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("CREATE PRODUCT BODY:", JSON.stringify(body, null, 2));

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    let categoryId = body.categoryId;
    if (!categoryId && body.category) {
      const cat = await prisma.category.findUnique({ where: { name: body.category } });
      if (!cat) {
        return NextResponse.json(
          { success: false, error: `Category "${body.category}" not found. Create the category first.` },
          { status: 400 }
        );
      }
      categoryId = cat.id;
    }

    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const sku = body.sku || `ZIXO-${Date.now().toString(36).toUpperCase()}`;

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug,
        sku,
        description: body.description || "",
        ingredients: body.ingredients || null,
        nutritionInfo: body.nutritionInfo || null,
        price: parseFloat(body.price),
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        stockQuantity: parseInt(body.stockQuantity || "0", 10),
        images: body.images || [],
        categoryId,
        isFeatured: body.isFeatured || false,
        isBestSeller: body.isBestSeller || false,
        isActive: body.isActive ?? true,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      },
      include: { category: true },
    });

    console.log("PRODUCT CREATED:", product.id);

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product,
    }, { status: 201 });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
