import { useState } from "react";
import { createPortal } from "react-dom";

type UserRole = "USER" | "ADMIN";
type UserStatus = "ACTIVE" | "NONACTIVE";

export default function AddUsers({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setApiError("");
    setSuccessMessage("");

    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/user/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          status,
        }),
      });
      if (!res.ok) {
        let data: any = {};

        try {
          data = await res.json();
        } catch {}

        // ===============================
        // 1️⃣ ZOD FIELD ERRORS
        // ===============================
        if (res.status === 400 && Array.isArray(data.errors)) {
          const fieldErrors: typeof errors = {};

          data.errors.forEach((err: any) => {
            const field = err.path?.[0];
            if (field && typeof err.message === "string") {
              fieldErrors[field as keyof typeof errors] = err.message;
            }
          });

          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
          }
        }

        // ===============================
        // 2️⃣ SINGLE MESSAGE (EMAIL DUPLICATE, ETC)
        // ===============================
        if (res.status === 400 || res.status === 409) {
          const msg = data.message || "Invalid request";

          if (msg.toLowerCase().includes("email")) {
            setErrors({ email: msg });
            return;
          }

          if (msg.toLowerCase().includes("password")) {
            setErrors({ password: msg });
            return;
          }

          if (msg.toLowerCase().includes("name")) {
            setErrors({ name: msg });
            return;
          }

          setApiError(msg);
          setTimeout(() => setApiError(""), 3000);
          return;
        }

        // ===============================
        // 3️⃣ OTHER ERRORS (401 / 500)
        // ===============================
        setApiError(data.message || "Failed to create user");
        setTimeout(() => setApiError(""), 3000);
        return;
      }

      setSuccessMessage("User successfully added");

      setTimeout(() => setSuccessMessage(""), 3000);

      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      setStatus("ACTIVE");

      onSuccess?.();
    } catch (err) {
      setApiError("Failed to add user");
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
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-green-700 shadow-lg animate-fade-in dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
            <svg
              className="h-6 w-6"
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
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 shadow-lg animate-fade-in dark:border-red-800 dark:bg-red-900/40 dark:text-red-300">
            <svg
              className="h-6 w-6"
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
        className="flex items-end gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-blue-700"
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
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold dark:text-white">
                Add User
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white ${errors.password ? "border-red-500" : ""}`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="NONACTIVE">NONACTIVE</option>
                  </select>
                </div>

                {/* Actions */}
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
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60"
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
