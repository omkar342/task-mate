// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { verifyToken } from "../../../middleware/auth";

// app/api/tasks/[id]/route.ts
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const auth = verifyToken(req);
    if (!auth.isValid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    const paramData = await params;

    const taskId = paramData.id;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: auth.userId },
      data,
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
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
): Promise<NextResponse> {
  try {
    const auth = verifyToken(req);
    if (!auth.isValid) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const paramData = await params;

    const taskId = paramData.id;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: auth.userId,
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting task" },
      { status: 500 }
    );
  }
}

//   export async function DELETE(req: Request) {
//     try {
//       // Authenticate user
//       const auth = await verifyToken(req);
//       if (!auth.isValid) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//       }

//       await connectToDatabase();

//       // Read task ID from request body
//       const { id } = await req.json();

//       if (!id) {
//         return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
//       }

//       // Delete the task where _id matches and belongs to the user
//       const deletedTask = await Task.findOneAndDelete({ _id: id, userId: auth.userId });

//       if (!deletedTask) {
//         return NextResponse.json({ message: "Task not found" }, { status: 404 });
//       }

//       return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
//     } catch (error) {
//       return NextResponse.json(
//         { message: "Error deleting task", error: (error as Error).message },
//         { status: 500 }
//       );
//     }
//   }
