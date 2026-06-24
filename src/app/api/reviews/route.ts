import { NextRequest, NextResponse } from "next/server";

const placeholderReviews = [
  { id: "rev-001", productId: "cc-001", customerId: "cust-001", name: "Priya Sharma", email: "priya@example.com", rating: 5, comment: "Absolutely divine! The chocolate chips are generous and the cookie is perfectly baked.", isApproved: true, createdAt: "2025-03-15T10:30:00Z" },
  { id: "rev-002", productId: "cc-001", customerId: null, name: "Amit Kumar", email: "amit@example.com", rating: 4, comment: "Great cookies, very fresh. A bit sweet for my taste though.", isApproved: true, createdAt: "2025-03-20T14:00:00Z" },
  { id: "rev-003", productId: "od-002", customerId: "cust-002", name: "Rahul Verma", email: "rahul@example.com", rating: 5, comment: "Best Oreo cookies I've ever had! Highly recommended.", isApproved: true, createdAt: "2025-04-05T09:15:00Z" },
  { id: "rev-004", productId: "mb-006", customerId: "cust-003", name: "Ananya Desai", email: "ananya@example.com", rating: 4, comment: "Lovely gift box. Everyone loved the variety.", isApproved: false, createdAt: "2025-06-10T14:45:00Z" },
  { id: "rev-005", productId: "rv-003", customerId: null, name: "Sneha Reddy", email: "sneha@example.com", rating: 5, comment: "The cheesecake stuffed red velvet is a game changer!", isApproved: false, createdAt: "2025-06-15T11:00:00Z" },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");

    let filtered = [...placeholderReviews];

    if (status === "approved") {
      filtered = filtered.filter((r) => r.isApproved);
    } else if (status === "pending") {
      filtered = filtered.filter((r) => !r.isApproved);
    }

    if (productId) {
      filtered = filtered.filter((r) => r.productId === productId);
    }

    return NextResponse.json({ success: true, reviews: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReview = {
      id: `rev-${Date.now()}`,
      ...body,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review: newReview,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
