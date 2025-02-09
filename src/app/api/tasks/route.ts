// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { verifyToken } from "../../middleware/auth";

// Get all tasks
export async function GET(req: Request) {
  try {
    const auth = verifyToken(req);
    if (!auth.isValid) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const tasks = await Task.find({ userId: auth.userId }).sort({ createdAt: 1 });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

// Create task
export async function POST(req: Request) {
  try {
    const auth = verifyToken(req);
    if (!auth.isValid) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const data = await req.json();
    const task = await Task.create({
      ...data,
      userId: auth.userId
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 }
    );
  }
}