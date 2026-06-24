import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalOrders, totalProducts, totalCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.customer.count(),
    ]);

    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const categoryData = await prisma.product.groupBy({
      by: ["categoryId"],
      _count: { id: true },
      where: { isActive: true },
    });

    const categories = await prisma.category.findMany();
    const categorySales = categoryData.map((c) => {
      const cat = categories.find((cat) => cat.id === c.categoryId);
      return { name: cat?.name || "Unknown", value: c._count.id };
    });

    const topProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { reviewCount: "desc" },
      take: 5,
      select: { id: true, name: true, reviewCount: true },
    });

    const recentTransactions = orders.slice(0, 10).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customerName,
      amount: o.total,
      status: o.orderStatus,
      date: o.createdAt.toISOString(),
    }));

    const analytics = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
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
      categorySales,
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
      topProducts: topProducts.map((p, i) => ({
        id: p.id,
        name: p.name,
        sales: p.reviewCount,
        revenue: p.reviewCount * 199,
      })),
      recentTransactions,
    };

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
