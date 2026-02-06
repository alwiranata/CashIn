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

type UserRole = "USER" | "ADMIN";
type UserStatus = "ACTIVE" | "NONACTIVE";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

interface ApiResponse {
  message: string;
  data: User[];
}

/* =======================
   COMPONENT
======================= */

type UserTableProps = {
  reloadKey: number;
};

export default function UserTable({ reloadKey }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* =======================
     FETCH USER
  ======================= */
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/user/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed fetch");

      const json: ApiResponse = await res.json();
      setUsers(json.data || []);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reloadKey]);

  /* =======================
     DELETE USER
  ======================= */
  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/user/delete/${deleteUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Delete failed");

      setSuccessMessage("User deleted successfully");
      fetchUsers();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal hapus user");
    } finally {
      setDeleting(false);
      setDeleteUserId(null);
    }
  };

  /* =======================
     EDIT USER
  ======================= */
  const handleEdit = (trx: User) => {
    setEditingUser(trx);
    setIsEditOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/user/update/${editingUser.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
            status: editingUser.status,
          }),
        },
      );

      if (!res.ok) throw new Error("Update failed");

      setSuccessMessage("User updated successfully");
      setIsEditOpen(false);
      setEditingUser(null);
      fetchUsers();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal update user");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     TYPE COLOR
  ======================= */
  const renderRoleColor = (type: UserRole) =>
    type === "USER" ? "light" : "primary";

  const renderStatusColor = (type: UserStatus) =>
    type === "ACTIVE" ? "success" : "error";

  if (loading) {
    return (
      <div className="p-5 text-gray-500 dark:text-gray-400">
        Loading users...
      </div>
    );
  }

  /* =======================
     PAGINATION LOGIC
  ======================= */
  const getPaginationPages = () => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 2) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 1)
      return ["...", totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
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
                "Name",
                "Email",
                "Role",
                "Status",
                "Date Active",
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
            {paginatedUsers.map((trx, index) => (
              <TableRow key={trx.id}>
                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {trx.name}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {trx.email}
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <Badge size="sm" color={renderRoleColor(trx.role)}>
                    {trx.role}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <Badge size="sm" color={renderStatusColor(trx.status)}>
                    {trx.status}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 text-start dark:text-gray-200">
                  {new Date(trx.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(trx)}
                      className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      onClick={() => setDeleteUserId(trx.id)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-6 text-gray-400 dark:text-gray-500">
                  No user found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 p-4 border-t dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50 dark:text-white"
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
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
                      : "border hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
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
              className="rounded border px-3 py-1 text-sm disabled:opacity-50 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ================= DELETE USER MODAL ================= */}
      {deleteUserId !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50"
            onClick={() => setDeleteUserId(null)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-800 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Delete Confirmation
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                This user will be deleted. Continue?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteUserId(null)}
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

      {/* ================= EDIT USER MODAL ================= */}
      {isEditOpen &&
        editingUser &&
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
                Edit User
              </h3>

              <form className="space-y-4" onSubmit={handleUpdateUser}>
                {/* User Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    User Name
                  </label>
                  <input
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Role
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as UserStatus,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="NONACTIVE">NONACTIVE</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </div>

                {/*Date  Created*/}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Date Active
                  </label>
                  <input
                    type="date"
                    value={editingUser.createdAt.slice(0, 10)}
                    disabled
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
