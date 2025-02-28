import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const reqBody = await req.json();
  const { mediaUrl } = reqBody;

  const authUserId = req.headers.get("X-Authenticated-User-ID");


  //Media not found return an error
  if (!mediaUrl) {
    return NextResponse.json(
      { message: "Media URL is required" },
      { status: 400 }
    );
  }

  try {
    await connect();

    //Find the user document by authUserId
    const user = await User.findOne({ _id: authUserId });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    //find the mediaitem and update the fav status
    const mediaItem = user.media.find((item) => item.url === mediaUrl);
    if (!mediaItem) {
      return NextResponse.json(
        {
          message: "Media not found or you don't have permission to update it",
        },
        { status: 403 }
      );
    }
    mediaItem.isFav = !mediaItem.isFav;

    await user.save();

    return NextResponse.json(
      { message: "Media set as fav successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error setting the media favorite:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
