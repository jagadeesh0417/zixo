import { NextResponse } from "next/server";

const placeholderCustomers = [
  { id: "cust-001", name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", isBlocked: false, orderCount: 5, totalSpent: 4590, createdAt: "2025-01-15T10:30:00Z" },
  { id: "cust-002", name: "Rahul Verma", email: "rahul@example.com", phone: "8765432109", isBlocked: false, orderCount: 3, totalSpent: 2890, createdAt: "2025-02-20T14:00:00Z" },
  { id: "cust-003", name: "Ananya Desai", email: "ananya@example.com", phone: "7654321098", isBlocked: false, orderCount: 2, totalSpent: 1560, createdAt: "2025-03-10T09:15:00Z" },
  { id: "cust-004", name: "Vikram Patel", email: "vikram@example.com", phone: "6543210987", isBlocked: true, orderCount: 1, totalSpent: 549, createdAt: "2025-04-05T16:45:00Z" },
  { id: "cust-005", name: "Neha Gupta", email: "neha@example.com", phone: "5432109876", isBlocked: false, orderCount: 8, totalSpent: 7230, createdAt: "2025-01-01T08:00:00Z" },
  { id: "cust-006", name: "Arjun Singh", email: null, phone: "4321098765", isBlocked: false, orderCount: 0, totalSpent: 0, createdAt: "2025-06-10T11:30:00Z" },
];

const orderHistory = [
  { id: "ord-001", orderNumber: "ZIXO-A1B2-C3D4", customerName: "Priya Sharma", total: 1078, orderStatus: "DELIVERED", items: [{ id: "item-1", productId: "cc-001", product: { name: "Classic Chocolate Chip Cookie" }, quantity: 2, price: 199, total: 398 }], createdAt: "2025-05-15T10:30:00Z" },
  { id: "ord-002", orderNumber: "ZIXO-E5F6-G7H8", customerName: "Rahul Verma", total: 1816, orderStatus: "PROCESSING", items: [], createdAt: "2025-06-01T09:15:00Z" },
  { id: "ord-003", orderNumber: "ZIXO-I9J0-K1L2", customerName: "Ananya Desai", total: 517, orderStatus: "PENDING", items: [], createdAt: "2025-06-10T14:45:00Z" },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = placeholderCustomers.find((c) => c.id === id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const orders = orderHistory.filter((o) => o.customerName === customer.name);

    return NextResponse.json({ success: true, customer: { ...customer, orders } });
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
    const index = placeholderCustomers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const body = await request.json();
    const updatedCustomer = { ...placeholderCustomers[index], ...body, id };

    return NextResponse.json({
      success: true,
      message: body.isBlocked !== undefined
        ? (body.isBlocked ? "Customer blocked successfully" : "Customer unblocked successfully")
        : "Customer updated successfully",
      customer: updatedCustomer,
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
    const index = placeholderCustomers.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
