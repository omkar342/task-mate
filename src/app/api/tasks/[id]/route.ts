import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { verifyToken } from "../../../middleware/auth";

// ✅ Update Task (PUT)
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const auth = await verifyToken(req);
    if (!auth || !auth.isValid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updatedTask = await Task.findOneAndUpdate(
      { _id: context.params.id, userId: auth.userId }, // ✅ Correct `context.params.id`
      body,
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully", task: updatedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating task", error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Delete Task (DELETE)
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const auth = await verifyToken(req);
    if (!auth || !auth.isValid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: context.params.id, // ✅ Correct `context.params.id`
      userId: auth.userId,
    });

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting task", error: (error as Error).message }, { status: 500 });
  }
}
