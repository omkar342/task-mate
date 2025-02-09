import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    return NextResponse.json({ message: "User created successfully", userId: newUser._id }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error }, { status: 500 });
  }
}
