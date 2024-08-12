import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconnect";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connect();
    const reqBody = await req.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

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

    if (user.googleId && !user.password) {
      return NextResponse.json(
        { message: "Please login with google account" },
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
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (e) {
    console.log("Something went wrong", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
