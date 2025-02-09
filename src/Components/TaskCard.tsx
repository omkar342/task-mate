import React from "react";

interface Task {
  _id?: string;
  title: string;
  description: string;
  dueDate?: string;
  status: boolean;
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // Format dueDate for better readability
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No Due Date";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <div
          className={`px-3 py-2 rounded-full text-sm ${
            task.status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {task.status ? "Completed" : "Pending"}
        </div>
      </div>

      <p className="text-gray-600 mb-2 flex-grow">{task.description}</p>

      {/* Display Due Date */}
      <p className="text-sm text-gray-500 mb-4">
        <strong>Due Date:</strong> {formattedDueDate}
      </p>

      {/* Buttons always at the bottom */}
      <div className="mt-auto flex flex-start gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm border border-[#C05F3C] text-[#C05F3C] rounded hover:bg-[#C05F3C] hover:text-white"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
