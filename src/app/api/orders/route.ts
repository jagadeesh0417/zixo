import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    const where: Record<string, unknown> = {};

    if (status) {
      where.orderStatus = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        paymentMethod: body.paymentMethod,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        subtotal: parseFloat(body.subtotal),
        discount: parseFloat(body.discount || "0"),
        shipping: parseFloat(body.shipping || "0"),
        tax: parseFloat(body.tax || "0"),
        total: parseFloat(body.total),
        couponCode: body.couponCode || null,
        notes: body.notes || null,
        items: {
          create: (body.items || []).map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
