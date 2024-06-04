import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const reqBody = await req.json();
  const { mediaUrl } = reqBody;
  try {
    await connect();
    const user = await User.findOneAndUpdate(
      { media: mediaUrl },
      { $pull: { media: mediaUrl } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json("User not found or media not found");
    }
    return NextResponse.json("Media deleted successfully");
  } catch (error) {
    console.error("Error deleting the media:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
