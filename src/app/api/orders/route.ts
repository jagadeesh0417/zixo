import { NextRequest, NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/utils";

const placeholderOrders = [
  {
    id: "ord-001", orderNumber: "ZIXO-A1B2-C3D4", customerName: "Priya Sharma", customerEmail: "priya@example.com",
    customerPhone: "9876543210", address: "42, MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001",
    paymentMethod: "COD", paymentStatus: "PENDING", paymentId: null, orderStatus: "DELIVERED", subtotal: 998,
    discount: 100, shipping: 0, tax: 180, total: 1078, couponCode: null, trackingNumber: "TRK-001", notes: null,
    items: [
      { id: "item-1", orderId: "ord-001", productId: "cc-001", product: { id: "cc-001", name: "Classic Chocolate Chip Cookie", slug: "classic-chocolate-chip", price: 199, images: [] }, quantity: 2, price: 199, total: 398 },
      { id: "item-2", orderId: "ord-001", productId: "od-002", product: { id: "od-002", name: "Oreo Delight Cookie", slug: "oreo-delight", price: 249, images: [] }, quantity: 1, price: 249, total: 249 },
    ],
    createdAt: "2025-05-15T10:30:00Z", updatedAt: "2025-05-18T14:00:00Z",
  },
  {
    id: "ord-002", orderNumber: "ZIXO-E5F6-G7H8", customerName: "Rahul Verma", customerEmail: "rahul@example.com",
    customerPhone: "8765432109", address: "15, Brigade Road", city: "Bangalore", state: "Karnataka", pincode: "560001",
    paymentMethod: "ONLINE", paymentStatus: "COMPLETED", paymentId: "pay_123abc", orderStatus: "PROCESSING", subtotal: 1497,
    discount: 0, shipping: 50, tax: 269, total: 1816, couponCode: null, trackingNumber: null, notes: "Leave at door",
    items: [
      { id: "item-3", orderId: "ord-002", productId: "mb-006", product: { id: "mb-006", name: "Signature Mixed Box", slug: "signature-mixed-box", price: 599, images: [] }, quantity: 1, price: 599, total: 599 },
      { id: "item-4", orderId: "ord-002", productId: "gx-012", product: { id: "gx-012", name: "Gourmet Gift Box", slug: "gourmet-gift-box", price: 1199, images: [] }, quantity: 1, price: 1199, total: 1199 },
    ],
    createdAt: "2025-06-01T09:15:00Z", updatedAt: "2025-06-01T09:15:00Z",
  },
  {
    id: "ord-003", orderNumber: "ZIXO-I9J0-K1L2", customerName: "Ananya Desai", customerEmail: "ananya@example.com",
    customerPhone: "7654321098", address: "7, Connaught Place", city: "Delhi", state: "Delhi", pincode: "110001",
    paymentMethod: "COD", paymentStatus: "PENDING", paymentId: null, orderStatus: "PENDING", subtotal: 438,
    discount: 0, shipping: 0, tax: 79, total: 517, couponCode: null, trackingNumber: null, notes: null,
    items: [
      { id: "item-5", orderId: "ord-003", productId: "rv-003", product: { id: "rv-003", name: "Red Velvet Cookie", slug: "red-velvet", price: 229, images: [] }, quantity: 2, price: 229, total: 458 },
    ],
    createdAt: "2025-06-10T14:45:00Z", updatedAt: "2025-06-10T14:45:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    let filtered = [...placeholderOrders];

    if (status) {
      filtered = filtered.filter((o) => o.orderStatus === status);
    }

    if (search) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.customerEmail.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, orders: filtered });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderNumber = generateOrderNumber();
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      ...body,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
