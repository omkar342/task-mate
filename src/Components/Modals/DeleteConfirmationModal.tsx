import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  task: { title: string } | null; // ✅ Task must have a `title`
  onClose: () => void; // ✅ Function that takes no arguments
  onConfirm: () => void; // ✅ Function that takes no arguments
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  task,
  onClose,
  onConfirm,
}) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Delete Task</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete "<strong>{task.title}</strong>"?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
