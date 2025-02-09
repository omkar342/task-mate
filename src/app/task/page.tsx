"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TaskCard from "../../Components/TaskCard";
import TaskModal from "../../Components/Modals/TaskModal";
import DeleteConfirmationModal from "../../Components/Modals/DeleteConfirmationModal";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const router = useRouter();

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (task = null) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeletingTask(null);
    setIsDeleteModalOpen(false);
  };

  interface Task {
    _id: string;
    title: string;
    description: string;
    status: boolean;
    dueDate: string;
  }

  const fetchTasks = async () => {
    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
      const res = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSaveTask = async (
    formData: Task,
    taskId: string | null = null
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";
      const method = taskId ? "PUT" : "POST";

      const taskData = {
        ...formData,
        status: formData?.status === null ? false : formData?.status,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) throw new Error("Failed to save task");

      fetchTasks();
      handleCloseModal();

      if (taskId) {
        toast.success("Task updated successfully!");
      } else {
        toast.success("Task added successfully!");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    const task = tasks.find((t: any) => t._id === taskId);
    if (!task) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: !task.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task status");

      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/tasks/${deletingTask._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter((task: any) => task._id !== deletingTask._id));
      handleCloseDeleteModal();
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token'); // Remove token from storage
      toast.success('Logged out successfully!');
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchTasks();
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-700">My Tasks</h1>
          <div className="flex gap-4">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-[#C05F3C] text-white px-4 py-2 rounded-md hover:bg-[#A04F2C]"
            >
              <Plus size={20} />
              Add Task
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Show Loading Indicator while fetching tasks */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <>
            <h2 className="text-gray-600 text-center">No tasks found!</h2>
            <h2 className="text-gray-600 text-center">Please add new tasks.</h2>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => handleOpenModal(task)}
                onDelete={() => handleOpenDeleteModal(task)}
                onToggleStatus={() => handleToggleStatus(task._id)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          task={deletingTask}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
