const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your account credentials
cloudinary.config({
  cloud_name: "drp7pfa2w",
  api_key: "178759751458433",
  api_secret: "IANxoWPUtRR-FdkwJhfEjXWaK78",
});

async function main() {
  // ──────────────────────────────────────────────
  // 1. Upload a sample image from Cloudinary's demo
  // ──────────────────────────────────────────────
  console.log("Uploading sample image...");
  const uploadResult = await cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    { folder: "zixo-onboarding" }
  );

  console.log("\n✓ Upload successful!");
  console.log("  Secure URL:", uploadResult.secure_url);
  console.log("  Public ID :", uploadResult.public_id);

  // ──────────────────────────────────────────────
  // 2. Get image details (metadata)
  // ──────────────────────────────────────────────
  const details = await cloudinary.api.resource(uploadResult.public_id);

  console.log("\n── Image Metadata ──");
  console.log("  Width      :", details.width, "px");
  console.log("  Height     :", details.height, "px");
  console.log("  Format     :", details.format);
  console.log("  File size  :", details.bytes, "bytes");

  // ──────────────────────────────────────────────
  // 3. Generate transformed URL with f_auto & q_auto
  //    f_auto = automatically serves the best format
  //             (e.g. WebP for Chrome, AVIF for Safari)
  //    q_auto = automatically selects optimal quality
  //             balancing file size and visual fidelity
  // ──────────────────────────────────────────────
  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    f_auto: true,
    q_auto: true,
  });

  console.log("\n── Optimized Image ──");
  console.log("  Transformed URL:", transformedUrl);
  console.log("\n✓ Done! Click the link above to see the optimized version.");
  console.log("  Check the size and format in your browser's DevTools.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
