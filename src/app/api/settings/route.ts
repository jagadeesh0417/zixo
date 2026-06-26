import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { badRequest } from "@/lib/auth";

const defaultSettings = {
  general: {
    siteName: "Zixo Cookies",
    siteDescription: "Handcrafted gourmet cookies delivered to your doorstep",
    supportEmail: "support@zixocookies.com",
    supportPhone: "+91-9876543210",
    address: "42, Baker's Street, Mumbai - 400001",
    currency: "INR",
    timezone: "Asia/Kolkata",
  },
  shipping: {
    freeShippingMin: 399,
    standardRate: 50,
    expressRate: 100,
    estimatedDays: "3-5 business days",
  },
  orders: {
    autoConfirm: true,
    cancelWindow: 30,
    returnWindow: 7,
  },
  notifications: {
    orderConfirmation: true,
    shippingUpdate: true,
    deliveryConfirmation: true,
    lowStockAlert: true,
    newOrderAlert: true,
  },
  seo: {
    metaTitle: "Zixo Cookies - Handcrafted Gourmet Cookies",
    metaDescription: "Premium handcrafted cookies made with love. Order online for delivery across India.",
    ogImage: "/images/og-image.jpg",
  },
  social: {
    facebook: "https://facebook.com/zixocookies",
    instagram: "https://instagram.com/zixocookies",
    twitter: "https://twitter.com/zixocookies",
  },
};

async function getSettings(): Promise<Record<string, any>> {
  const rows = await prisma.siteSetting.findMany();
  const stored: Record<string, any> = {};
  for (const row of rows) {
    try {
      stored[row.key] = JSON.parse(row.value);
    } catch {
      stored[row.key] = row.value;
    }
  }
  return { ...defaultSettings, ...stored };
}

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return badRequest("No settings provided to update");
    }

    for (const [key, value] of Object.entries(body)) {
      const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: stringValue },
        create: { key, value: stringValue },
      });
    }

    const settings = await getSettings();

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
