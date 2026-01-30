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

export default function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /* =======================
     FETCH TASK
  ======================= */
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token"); // sesuaikan key token kamu

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
  }, []);

  /* =======================
     DELETE TASK
  ======================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus task ini?")) return;

    try {
      await fetch(`http://localhost:3000/api/task/delete/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Gagal hapus task");
    }
  };

  /* =======================
     EDIT TASK (sementara)
  ======================= */
  const handleEdit = (task: Task) => {
    alert(`Edit Task: ${task.nameTask}`);
    // nanti bisa dibuat modal edit
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
    return <div className="p-5">Loading tasks...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* ================= HEADER ================= */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start">
                No
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Task Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Start
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Finish
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Image
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ================= BODY ================= */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tasks.map((task, index) => (
              <TableRow key={task.id}>
                {/* ID */}
                <TableCell className="px-4 py-3 text-start">
                  {index + 1}
                </TableCell>

                {/* TASK NAME */}
                <TableCell className="px-4 py-3 text-start">
                  {task.nameTask}
                </TableCell>

                {/* START */}
                <TableCell className="px-4 py-3 text-start">
                  {new Date(task.startTask).toLocaleDateString()}
                </TableCell>

                {/* FINISH */}
                <TableCell className="px-4 py-3 text-start">
                  {new Date(task.finishTask).toLocaleDateString()}
                </TableCell>

                {/* STATUS */}
                <TableCell className="px-4 py-3 text-start">
                  <Badge size="sm" color={renderStatusColor(task.statusTask)}>
                    {task.statusTask}
                  </Badge>
                </TableCell>

                {/* Image */}
                <TableCell className="px-4 py-3 text-start">
                  <button
                    onClick={() => setPreviewImage(task.image ?? null)}
                    className="px-3 py-1 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </TableCell>

                {/* ACTION */}
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
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
                <TableCell className="text-center py-6 text-gray-400">
                  No tasks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {previewImage &&
        createPortal(
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full relative">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto rounded-lg object-contain"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
