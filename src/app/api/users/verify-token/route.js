import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  const reqBody = await request.json();
  const { token } = reqBody;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return NextResponse.json({ valid: true, authUserId: payload.id });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Invalid token" });
  }
}
