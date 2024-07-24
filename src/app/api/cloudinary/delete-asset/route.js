import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL not provided" }, { status: 400 });
    }

    // Extract asset ID from the URL
    const assetMatch = url.match(/\/v\d+\/(.+?)\.([^.]+)$/);
    if (!assetMatch) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const asset = assetMatch[1];
    const fileExtension = assetMatch[2].toLowerCase();

    // Helper function to determine the file type
    const getFileType = (extension) => {
      switch (extension) {
        case "mp4":
          return "video";
        case "pdf":
          return "pdf";
        default:
          return "image";
      }
    };

    const fileType = getFileType(fileExtension);

    let result;
    if (fileType === "video") {
      result = await cloudinary.uploader.destroy(asset, {
        resource_type: "video",
      });
    } else {
      result = await cloudinary.uploader.destroy(asset);
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
