import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    // console.log(reqBody);

    // Check if user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please sign up" },
        { status: 400 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please Verify your account" },
        { status: 400 }
      );
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      console.log("Incorrect password. Please try again");
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    // Update lastLogin field
    user.lastLogin = new Date();
    await user.save();

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (e) {
    console.log("Something went wrong", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
