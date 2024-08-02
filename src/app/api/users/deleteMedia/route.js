import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const reqBody = await req.json();
  const { mediaUrl } = reqBody;

  const authUserId = req.headers.get("X-Authenticated-User-ID");

  if (!mediaUrl) {
    return NextResponse.json(
      { message: "Media URL is required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    const user = await User.findOneAndUpdate(
      { _id: authUserId, "media.url": mediaUrl },
      { $pull: { media: { url: mediaUrl } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "Media not found or you don't have permission to delete it",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Media deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting the media:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
