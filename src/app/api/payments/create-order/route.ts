import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, receipt } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    console.log(`[PAYMENT] Creating Razorpay order: amount=${amount}, receipt=${receipt}`);

    const options = {
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);

    console.log(`[PAYMENT] Razorpay order created: ${order.id}`);

    return NextResponse.json({
      success: true,
      id: order.id,
      key_id: process.env.RAZORPAY_KEY_ID,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("[PAYMENT] Create order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
