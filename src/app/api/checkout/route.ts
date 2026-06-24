import { NextResponse } from "next/server";
import { badRequest } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerInfo, items, paymentMethod, couponCode } = body;

    if (!customerInfo || !items || !items.length) {
      return badRequest("Customer information and items are required");
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return badRequest("Name, phone, and address are required");
    }

    const orderNumber = generateOrderNumber();
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 399 ? 0 : 50;
    let discount = 0;

    if (couponCode) {
      discount = Math.round(subtotal * 0.1);
    }

    const total = subtotal + tax + shipping - discount;

    const order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email || null,
      customerPhone: customerInfo.phone,
      address: customerInfo.address,
      city: customerInfo.city || "",
      state: customerInfo.state || "",
      pincode: customerInfo.pincode || "",
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
      paymentId: null,
      orderStatus: "PENDING",
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode: couponCode || null,
      trackingNumber: null,
      notes: customerInfo.notes || null,
      items: items.map((item: { productId: string; name: string; price: number; quantity: number; image?: string }, i: number) => ({
        id: `item-${Date.now()}-${i}`,
        orderId: `ord-${Date.now()}`,
        productId: item.productId,
        product: { id: item.productId, name: item.name, price: item.price, images: item.image ? [item.image] : [] },
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
