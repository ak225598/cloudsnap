import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconnect";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        {
          message: "Incorrect password",
        },
        { status: 400 }
      );
    }

    await User.findOneAndDelete({ email });

    const response = NextResponse.json({
      message: "Account successfully deleted",
      success: true,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
