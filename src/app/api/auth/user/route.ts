import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await connectToDatabase();
//   const { username, password } = await req.json();

    console.log("username");

   return NextResponse.json({ message: "User created", username: "username", password: "password" }, { status: 200 });
}
