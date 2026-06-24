import { NextRequest, NextResponse } from "next/server";

const placeholderCustomers = [
  { id: "cust-001", name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", isBlocked: false, orderCount: 5, totalSpent: 4590, createdAt: "2025-01-15T10:30:00Z" },
  { id: "cust-002", name: "Rahul Verma", email: "rahul@example.com", phone: "8765432109", isBlocked: false, orderCount: 3, totalSpent: 2890, createdAt: "2025-02-20T14:00:00Z" },
  { id: "cust-003", name: "Ananya Desai", email: "ananya@example.com", phone: "7654321098", isBlocked: false, orderCount: 2, totalSpent: 1560, createdAt: "2025-03-10T09:15:00Z" },
  { id: "cust-004", name: "Vikram Patel", email: "vikram@example.com", phone: "6543210987", isBlocked: true, orderCount: 1, totalSpent: 549, createdAt: "2025-04-05T16:45:00Z" },
  { id: "cust-005", name: "Neha Gupta", email: "neha@example.com", phone: "5432109876", isBlocked: false, orderCount: 8, totalSpent: 7230, createdAt: "2025-01-01T08:00:00Z" },
  { id: "cust-006", name: "Arjun Singh", email: null, phone: "4321098765", isBlocked: false, orderCount: 0, totalSpent: 0, createdAt: "2025-06-10T11:30:00Z" },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.toLowerCase();

    let filtered = [...placeholderCustomers];

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          (c.email && c.email.toLowerCase().includes(search)) ||
          c.phone.includes(search)
      );
    }

    return NextResponse.json({ success: true, customers: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
