import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, link, name } = reqBody;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
    }

    const newMediaItem = {
      url: link,
      name: name,
      createdAt: Date.now(),
    };

    user.media.push(newMediaItem);
    await user.save();

    return NextResponse.json(
      { message: "Media link updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
