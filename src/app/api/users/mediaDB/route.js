import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, link } = reqBody;
    // console.log(email)
    // console.log(link)
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User does not exist");
      return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
    }

    // Update the media array with the new link
    user.media.push(link);
    await user.save();
    return NextResponse.json({ message: "Media link updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error });
  }
}
