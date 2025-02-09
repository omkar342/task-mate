import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
