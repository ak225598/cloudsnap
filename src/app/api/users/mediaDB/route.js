import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, link, name } = reqBody;

    const authUserId = req.headers.get("X-Authenticated-User-ID");

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (authUserId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: User ID mismatch" },
        { status: 401 }
      );
    }

    const newMediaItem = {
      url: link,
      name: name,
      createdAt: Date.now(),
    };

    user.media.push(newMediaItem);
    await user.save();

    return NextResponse.json(
      { message: "Media link added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
