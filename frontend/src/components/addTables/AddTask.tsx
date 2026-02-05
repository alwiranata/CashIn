import { useState } from "react";
import { createPortal } from "react-dom";

type StatusTask = "PENDING" | "PROGRESS" | "DONE";

export default function AddTask({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nameTask, setNameTask] = useState("");
  const [statusTask, setStatusTask] = useState<StatusTask>("PENDING");
  const [startTask, setStartTask] = useState("");
  const [finishTask, setFinishTask] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [errors, setErrors] = useState<{
    nameTask?: string;
  }>({});
  function getFileName(pathOrBase64: string) {
    if (!pathOrBase64) return "No file chosen";

    if (pathOrBase64.startsWith("data:image")) {
      return "image.jpg";
    }

    return pathOrBase64.split("/").pop() || "image.jpg";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setApiError("");
    setSuccessMessage("");

    const newErrors: typeof errors = {};

    if (!nameTask.trim()) {
      newErrors.nameTask = "Task name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/task/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameTask,
          statusTask,
          startTask: startTask || undefined,
          finishTask: finishTask || undefined,
          image: imageBase64 || "",
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");
      setSuccessMessage("Task added successfully");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      setOpen(false);
      setNameTask("");
      setStatusTask("PENDING");
      setStartTask("");
      setFinishTask("");
      setImageFile(null);
      setImageBase64("");

      onSuccess?.(); // 🔥 refresh table tanpa reload
    } catch (err) {
      setApiError("Failed to add task");
      setTimeout(() => setApiError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* alert success */}
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

      {/* alert error */}
      {apiError && (
        <div className="fixed top-6 left-1/2 z-[999999] -translate-x-1/2">
          <div
            className="
        flex items-center gap-3
        rounded-xl border border-red-200
        bg-red-50 px-6 py-4
        text-red-700 shadow-lg
        animate-fade-in
        dark:border-red-800
        dark:bg-red-900/40
        dark:text-red-300
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <span className="text-sm font-semibold">{apiError}</span>
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-end  gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <i className="bi bi-vector-pen"></i>
      </button>

      {/* MODAL */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onMouseDown={() => setOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800 shadow-lg"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Add Task
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Task Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Task Name
                  </label>
                  <input
                    value={nameTask}
                    onChange={(e) => {
                      setNameTask(e.target.value);
                      setErrors((prev) => ({ ...prev, nameTask: undefined }));
                    }}
                    className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white
    ${errors.nameTask ? "border-red-500" : ""}`}
                  />

                  {errors.nameTask && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.nameTask}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startTask}
                    onChange={(e) => setStartTask(e.target.value)}
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
                    value={finishTask}
                    onChange={(e) => setFinishTask(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    value={statusTask}
                    onChange={(e) =>
                      setStatusTask(e.target.value as StatusTask)
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

                  {/* Custom upload box */}
                  <div className="mb-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <span className="flex-1 truncate">
                      {imageFile
                        ? imageFile.name
                        : imageBase64
                          ? getFileName(imageBase64)
                          : "No file chosen"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("addTaskFileInput")?.click()
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  </div>

                  {/* Hidden input */}
                  <input
                    id="addTaskFileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setImageFile(file);

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImageBase64(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
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
    </>
  );
}
