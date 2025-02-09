// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { verifyToken } from "../../../middleware/auth";

// app/api/tasks/[id]/route.ts
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
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
      const task = await Task.findOneAndUpdate(
        { _id: params.id, userId: auth.userId },
        data,
        { new: true }
      );
      
      if (!task) {
        return NextResponse.json(
          { message: "Task not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(task);
    } catch (error) {
      return NextResponse.json(
        { message: "Error updating task" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const auth = verifyToken(req);
      if (!auth.isValid) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 401 }
        );
      }
  
      await connectToDatabase();
      const task = await Task.findOneAndDelete({ 
        _id: params.id,
        userId: auth.userId 
      });
      
      if (!task) {
        return NextResponse.json(
          { message: "Task not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        { message: "Error deleting task" },
        { status: 500 }
      );
    }
  }