import { NextResponse } from "next/server";

const placeholderReviews = [
  { id: "rev-001", productId: "cc-001", customerId: "cust-001", name: "Priya Sharma", email: "priya@example.com", rating: 5, comment: "Absolutely divine!", isApproved: true, createdAt: "2025-03-15T10:30:00Z" },
  { id: "rev-002", productId: "cc-001", customerId: null, name: "Amit Kumar", email: "amit@example.com", rating: 4, comment: "Great cookies.", isApproved: true, createdAt: "2025-03-20T14:00:00Z" },
  { id: "rev-003", productId: "od-002", customerId: "cust-002", name: "Rahul Verma", email: "rahul@example.com", rating: 5, comment: "Best Oreo cookies!", isApproved: true, createdAt: "2025-04-05T09:15:00Z" },
  { id: "rev-004", productId: "mb-006", customerId: "cust-003", name: "Ananya Desai", email: "ananya@example.com", rating: 4, comment: "Lovely gift box.", isApproved: false, createdAt: "2025-06-10T14:45:00Z" },
  { id: "rev-005", productId: "rv-003", customerId: null, name: "Sneha Reddy", email: "sneha@example.com", rating: 5, comment: "Game changer!", isApproved: false, createdAt: "2025-06-15T11:00:00Z" },
];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const index = placeholderReviews.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const body = await request.json();
    const updatedReview = { ...placeholderReviews[index], ...body, id };

    return NextResponse.json({
      success: true,
      message: body.isApproved !== undefined
        ? (body.isApproved ? "Review approved successfully" : "Review rejected successfully")
        : "Review updated successfully",
      review: updatedReview,
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
    const index = placeholderReviews.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
