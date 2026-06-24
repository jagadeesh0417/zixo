import { NextResponse } from "next/server";

export async function GET() {
  try {
    const analytics = {
      totalRevenue: 425890,
      totalOrders: 847,
      averageOrderValue: 503,
      conversionRate: 3.2,
      customerAcquisitionCost: 45,
      repeatPurchaseRate: 38.5,
      monthlyRevenue: [
        { month: "Jan", revenue: 28500 },
        { month: "Feb", revenue: 32400 },
        { month: "Mar", revenue: 35800 },
        { month: "Apr", revenue: 34200 },
        { month: "May", revenue: 42100 },
        { month: "Jun", revenue: 38900 },
        { month: "Jul", revenue: 41200 },
        { month: "Aug", revenue: 38600 },
        { month: "Sep", revenue: 45300 },
        { month: "Oct", revenue: 42900 },
        { month: "Nov", revenue: 46700 },
        { month: "Dec", revenue: 52390 },
      ],
      dailySales: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2025, 5, i + 1).toISOString().split("T")[0],
        sales: Math.floor(Math.random() * 15000) + 5000,
      })),
      categorySales: [
        { name: "Chocolate", value: 35 },
        { name: "Oreo", value: 20 },
        { name: "Red Velvet", value: 15 },
        { name: "Butter", value: 18 },
        { name: "Mixed Boxes", value: 12 },
      ],
      customerGrowth: [
        { month: "Jan", customers: 45 },
        { month: "Feb", customers: 52 },
        { month: "Mar", customers: 68 },
        { month: "Apr", customers: 55 },
        { month: "May", customers: 72 },
        { month: "Jun", customers: 61 },
        { month: "Jul", customers: 78 },
        { month: "Aug", customers: 64 },
        { month: "Sep", customers: 85 },
        { month: "Oct", customers: 73 },
        { month: "Nov", customers: 91 },
        { month: "Dec", customers: 103 },
      ],
      topProducts: [
        { id: "mb-006", name: "Signature Mixed Box", sales: 203, revenue: 121797 },
        { id: "cc-001", name: "Classic Chocolate Chip Cookie", sales: 124, revenue: 24676 },
        { id: "dc-005", name: "Double Chocolate Fudge Cookie", sales: 112, revenue: 29008 },
        { id: "od-002", name: "Oreo Delight Cookie", sales: 98, revenue: 24302 },
        { id: "gx-012", name: "Gourmet Gift Box", sales: 78, revenue: 93522 },
      ],
      recentTransactions: [
        { id: "ord-003", orderNumber: "ZIXO-I9J0-K1L2", customer: "Ananya Desai", amount: 517, status: "PENDING", date: "2025-06-10T14:45:00Z" },
        { id: "ord-002", orderNumber: "ZIXO-E5F6-G7H8", customer: "Rahul Verma", amount: 1816, status: "COMPLETED", date: "2025-06-01T09:15:00Z" },
        { id: "ord-001", orderNumber: "ZIXO-A1B2-C3D4", customer: "Priya Sharma", amount: 1078, status: "COMPLETED", date: "2025-05-15T10:30:00Z" },
      ],
    };

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
