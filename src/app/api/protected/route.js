import { NextResponse } from "next/server";
import { verifyToken } from "../../../utils/jwt";
import dbConnect from "../../../utils/db";

export async function GET(req) {
  await dbConnect();

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    return NextResponse.json(
      { message: "Token valid!", user: decoded },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
