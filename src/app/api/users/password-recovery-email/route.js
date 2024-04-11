import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email } = reqBody;
    // console.log(reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const username = user.username;
    await sendEmail({ email, emailType: "RESET", userId: user.id, username });

    return NextResponse.json({
      message: "Email sent to reset password",
      success: true,
      user,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
