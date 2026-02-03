import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

/* =======================
   TYPES
======================= */

type StatusTask = "PENDING" | "PROGRESS" | "DONE";

interface Task {
  id: number;
  nameTask: string;
  image: string | null;
  startTask: string;
  finishTask: string;
  statusTask: StatusTask;
  createdById: number;
  createdAt: string;
  updateAt: string;
}

interface ApiResponse {
  message: string;
  data: Task[];
}

/* =======================
   COMPONENT
======================= */
type TasksTableProps = {
  reloadKey: number;
};

export default function TasksTable({ reloadKey }: TasksTableProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* =======================
     FETCH TASK
  ======================= */
  // Ambil nama file dari path / base64
  function getFileName(pathOrBase64: string) {
    // Kalau base64, cukup pakai "file.jpg"
    if (pathOrBase64.startsWith("data:image")) {
      return "image.jpg"; // default nama
    }
    // Kalau URL / path, ambil bagian terakhir
    return pathOrBase64.split("/").pop() || "image.jpg";
  }

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/task/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unauthorized / Failed Fetch");
      }

      const json: ApiResponse = await res.json();
      setTasks(json.data || []);
    } catch (error) {
      console.error("Failed fetch task:", error);
      alert("Gagal mengambil data task (Unauthorized)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [reloadKey]);

  /* =======================
     DELETE TASK
  ======================= */
  const handleConfirmDelete = async () => {
    if (deleteTaskId === null) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/task/delete/${deleteTaskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to delete task");

      setSuccessMessage("Task deleted successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Gagal hapus task");
    } finally {
      setDeleting(false);
      setDeleteTaskId(null);
    }
  };

  /* =======================
     EDIT TASK
  ======================= */
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setImageFile(null);
    setIsEditOpen(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/task/update/${editingTask.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameTask: editingTask.nameTask,
            statusTask: editingTask.statusTask.toUpperCase(),
            startTask: new Date(editingTask.startTask).toISOString(),
            finishTask: new Date(editingTask.finishTask).toISOString(),
            image: editingTask.image || "", // base64 atau path baru
          }),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        alert(json.message || "Gagal update task");
        return;
      }

      // === UPDATE STATE TASKS LANGSUNG ===
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...editingTask } // update semua field termasuk image
            : task,
        ),
      );

      setSuccessMessage("Task successfully updated");
      setIsEditOpen(false);
      setEditingTask(null);
      setCurrentPage(1);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     STATUS COLOR
  ======================= */
  const renderStatusColor = (status: StatusTask) => {
    if (status === "DONE") return "success";
    if (status === "PROGRESS") return "warning";
    return "error";
  };

  if (loading) {
    return (
      <div className="p-5 text-gray-500 dark:text-gray-400">
        Loading tasks...
      </div>
    );
  }

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // awal
    if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    // akhir
    if (currentPage >= totalPages - 1) {
      pages.push("...", totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    // tengah
    pages.push(
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    );

    return pages;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {successMessage && (
        <div className="fixed top-6 left-1/2 z-[999999] -translate-x-1/2">
          <div
            className="
        flex items-center gap-3
        rounded-xl border border-green-200
        bg-green-50 px-6 py-4
        text-green-700 shadow-lg
        animate-fade-in
        dark:border-green-800
        dark:bg-green-900/40
        dark:text-green-300
      "
          >
            <svg
              className="h-6 w-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>

            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* ================= HEADER ================= */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {[
                "No",
                "Task Name",
                "Start",
                "Finish",
                "Status",
                "Image",
                "Action",
              ].map((title) => (
                <TableCell
                  key={title}
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 text-theme-xs font-medium dark:text-gray-400"
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* ================= BODY ================= */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedTasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {task.nameTask}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-200">
                  {new Date(task.startTask).toLocaleDateString()}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-200">
                  {new Date(task.finishTask).toLocaleDateString()}
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <Badge size="sm" color={renderStatusColor(task.statusTask)}>
                    {task.statusTask}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <button
                    onClick={() => setPreviewImage(task.image ?? null)}
                    className="px-3 py-1  text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      onClick={() => setDeleteTaskId(task.id)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {tasks.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-6 text-gray-400 dark:text-gray-500">
                  No tasks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 p-4">
          {/* PREV */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          {/* PAGE NUMBERS (MAX 3 + ...) */}
          {getPaginationPages().map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setCurrentPage(page as number)}
                className={`rounded px-3 py-1 text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ),
          )}

          {/* NEXT */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ================= DELETE TASK MODAL ================= */}
      {deleteTaskId !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50"
            onClick={() => setDeleteTaskId(null)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-800 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Delete Confirmation
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this task?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTaskId(null)}
                  className="rounded-lg border px-4 py-2 text-sm dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {previewImage &&
        createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl relative w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <img
                src={previewImage}
                alt="Preview"
                className="
                p-5
            w-full 
            h-auto 
            max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] 
            rounded-lg 
            object-contain
          "
              />
            </div>
          </div>,
          document.body,
        )}

      {/* ================= EDIT TASK MODAL ================= */}
      {isEditOpen &&
        editingTask &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onMouseDown={() => setIsEditOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800 shadow-lg"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Edit Task
              </h3>

              <form className="space-y-4" onSubmit={handleUpdateTask}>
                {/* Task Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Task Name
                  </label>
                  <input
                    value={editingTask.nameTask}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        nameTask: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.startTask.slice(0, 10)}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        startTask: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Finish Date */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Finish Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.finishTask.slice(0, 10)}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        finishTask: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    value={editingTask.statusTask}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        statusTask: e.target.value as StatusTask,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROGRESS">PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Image
                  </label>

                  {/* Kotak custom */}
                  <div className="mb-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <span className="flex-1 truncate">
                      {imageFile?.name ||
                        (editingTask.image
                          ? getFileName(editingTask.image)
                          : "No file chosen")}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  </div>

                  {/* Sembunyikan input asli */}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setImageFile(file);

                      // Buat preview

                      // Update langsung state editingTask.image dengan base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (editingTask) {
                          setEditingTask({
                            ...editingTask,
                            image: reader.result as string, // ini base64
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="rounded-lg border px-4 py-2 text-sm dark:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
