import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { username, email } = reqBody;
    await User.findOneAndUpdate({ email: email }, { username: username });
    return NextResponse.json({
      message: "Username changed successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
