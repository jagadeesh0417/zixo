import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePaymentSignature } from "@/lib/razorpay";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerInfo,
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment details" }, { status: 400 });
    }

    const isValid = validatePaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      console.error(`[PAYMENT] Invalid signature for order ${razorpay_order_id}, payment ${razorpay_payment_id}`);
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    console.log(`[PAYMENT] Signature verified: order=${razorpay_order_id}, payment=${razorpay_payment_id}`);

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerInfo.fullName || customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.mobile || customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city || "",
        state: customerInfo.state || "",
        pincode: customerInfo.pincode || "",
        paymentMethod: "RAZORPAY",
        paymentStatus: "COMPLETED",
        paymentId: razorpay_payment_id,
        orderStatus: "PENDING",
        subtotal: parseFloat(subtotal) || 0,
        discount: parseFloat(discount) || 0,
        shipping: parseFloat(shipping) || 0,
        tax: parseFloat(tax) || 0,
        total: parseFloat(total) || 0,
        couponCode: couponCode || null,
        items: {
          create: (items || []).map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    console.log(`[ORDER] Created order ${orderNumber} (${order.id}) after successful payment ${razorpay_payment_id}`);

    for (const item of items || []) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      console.log(`[INVENTORY] Reduced stock for product ${item.productId} by ${item.quantity}`);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order created",
      order,
    }, { status: 201 });
  } catch (error) {
    console.error("[PAYMENT] Verify error:", error);
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
