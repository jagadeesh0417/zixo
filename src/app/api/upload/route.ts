import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "zixo-cookies", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }, { status: 201 });
  } catch (err) {
    const envCheck = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "found" : "MISSING",
      api_key: process.env.CLOUDINARY_API_KEY ? "found" : "MISSING",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "found" : "MISSING",
    };
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message, env: envCheck }, { status: 500 });
  }
}