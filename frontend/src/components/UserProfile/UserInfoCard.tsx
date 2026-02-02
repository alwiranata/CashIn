import { useModal } from "../../hooks/useModal";
import { jwtDecode } from "jwt-decode";
import { createPortal } from "react-dom";
import { useState } from "react";

interface MyJwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function UserInfoCard() {
  const { openModal, closeModal, isOpen } = useModal();

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<MyJwtPayload>(token) : null;

  /* ================= FORM STATE ================= */
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* ================= SUBMIT HANDLER ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/user/update/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
          }),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Gagal update profile");
        return;
      }

      /**
       * WAJIB:
       * backend harus return JWT baru
       * contoh response: { token: "new_jwt" }
       */
      if (json.token) {
        localStorage.setItem("token", json.token);
      }

      setSuccessMessage("Profile berhasil diperbarui");

      closeModal();

      // ⏳ kasih waktu alert tampil
      setTimeout(() => {
        window.location.reload();
      }, 3200);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
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

            <span className=" text-center  text-sm font-semibold ">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.name || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.role || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
            />
          </svg>
          Edit
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50"
            onMouseDown={closeModal}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Edit Personal Information
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border px-4 py-2 text-sm dark:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600  px-4 py-2 text-sm text-white"
                  >
                    {loading ? "Saving..." : "Save"}
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
