import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { username } = reqBody;

    const authUserId = request.headers.get("X-Authenticated-User-ID");

    if (!authUserId) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: authUserId },
      { username: username },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Username changed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error changing username:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
