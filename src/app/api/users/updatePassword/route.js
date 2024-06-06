import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, currentPassword, newPassword } = reqBody;

    const user = await User.findOne({ email });
    const validPassword = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!validPassword) {
      console.log("Incorrect Current Password");
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json(
      { message: "Password changed Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
