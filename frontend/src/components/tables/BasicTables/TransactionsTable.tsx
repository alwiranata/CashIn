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

type TypeTransaction = "INCOME" | "EXPENSE";

interface Transaction {
  id: number;
  nameTransaction: string; //
  price: number | string;
  image: string | null; //
  typeTransaction: TypeTransaction; //
  transactionDate: string;
  createdById: number;
  createdAt: string;
  updateAt: string;
}

interface ApiResponse {
  message: string;
  data: Transaction[];
}

/* =======================
   COMPONENT
======================= */

type TransactionTableProps = {
  reloadKey: number;
};

export default function TransactionTable({ reloadKey }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  /* =======================
     USD FORMAT
  ======================= */
  function formatUSD(value: number | string) {
    const numberValue = typeof value === "string" ? Number(value) : value;

    if (isNaN(numberValue)) return "$0";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0, // tanpa desimal
    }).format(numberValue);
  }

  /* =======================
     UTIL
  ======================= */
  function getFileName(pathOrBase64: string) {
    if (pathOrBase64.startsWith("data:image")) return "image.jpg";
    return pathOrBase64.split("/").pop() || "image.jpg";
  }

  /* =======================
     FETCH TRANSACTION
  ======================= */
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/transaction/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed fetch");

      const json: ApiResponse = await res.json();
      setTransactions(json.data || []);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [reloadKey]);

  /* =======================
     DELETE TRANSACTION
  ======================= */
  const handleConfirmDelete = async () => {
    if (!deleteTransactionId) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/transaction/delete/${deleteTransactionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Delete failed");

      setSuccessMessage("Transaction deleted successfully");
      fetchTransactions();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal hapus transaction");
    } finally {
      setDeleting(false);
      setDeleteTransactionId(null);
    }
  };

  /* =======================
     EDIT TRANSACTION
  ======================= */
  const handleEdit = (trx: Transaction) => {
    setEditingTransaction(trx);
    setImageFile(null);
    setIsEditOpen(true);
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/transaction/update/${editingTransaction.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameTransaction: editingTransaction.nameTransaction,
            price: editingTransaction.price,
            typeTransaction: editingTransaction.typeTransaction,
            transactionDate: editingTransaction.transactionDate,
            image: editingTransaction.image,
          }),
        },
      );

      if (!res.ok) throw new Error("Update failed");

      setSuccessMessage("Transaction updated successfully");
      setIsEditOpen(false);
      setEditingTransaction(null);
      fetchTransactions();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal update transaction");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     TYPE COLOR
  ======================= */
  const renderTypeColor = (type: TypeTransaction) =>
    type === "INCOME" ? "success" : "error";

  if (loading) {
    return (
      <div className="p-5 text-gray-500 dark:text-gray-400">
        Loading transactions...
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
              {["No", "Name", "Price", "Image", "Type", "Date", "Action"].map(
                (title) => (
                  <TableCell
                    key={title}
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 text-theme-xs font-medium dark:text-gray-400"
                  >
                    {title}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHeader>

          {/* ================= BODY ================= */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedTransactions.map((trx, index) => (
              <TableRow key={trx.id}>
                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {trx.nameTransaction}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  {formatUSD(trx.price)}
                </TableCell>

                <TableCell className="px-4 py-3 text-start text-gray-800 dark:text-gray-200">
                  <button
                    onClick={() => setPreviewImage(trx.image ?? null)}
                    className="px-3 py-1  text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </TableCell>

                <TableCell className="px-4 py-3 text-start">
                  <Badge size="sm" color={renderTypeColor(trx.typeTransaction)}>
                    {trx.typeTransaction}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 text-start dark:text-gray-200">
                  {new Date(trx.transactionDate).toLocaleDateString()}
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
                      onClick={() => setDeleteTransactionId(trx.id)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {transactions.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-6 text-gray-400 dark:text-gray-500">
                  No transaction found
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

      {/* ================= DELETE TRANSACTION MODAL ================= */}
      {deleteTransactionId !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50"
            onClick={() => setDeleteTransactionId(null)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-800 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Delete Confirmation
              </h3>
              <p className="mb-6  text-gray-600 dark:text-gray-300">
                This transaction will be deleted. Continue?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTransactionId(null)}
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

      {/* ================= EDIT TRANSACTION MODAL ================= */}
      {isEditOpen &&
        editingTransaction &&
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
                Edit Transaction
              </h3>

              <form className="space-y-4" onSubmit={handleUpdateTransaction}>
                {/* Transaction Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Transaction Name
                  </label>
                  <input
                    value={editingTransaction.nameTransaction}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        nameTransaction: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Price
                  </label>
                  <input
                    value={editingTransaction.price}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
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
                        (editingTransaction.image
                          ? getFileName(editingTransaction.image)
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

                      // Update langsung state editingtransaction.image dengan base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (editingTransaction) {
                          setEditingTransaction({
                            ...editingTransaction,
                            image: reader.result as string, // ini base64
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Type
                  </label>
                  <select
                    value={editingTransaction.typeTransaction}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        typeTransaction: e.target.value as TypeTransaction,
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="INCOME">INCOME</option>
                    <option value="EXPENSE">EXPENSE</option>
                  </select>
                </div>

                {/* Transaction Date */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={editingTransaction.transactionDate.slice(0, 10)}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        transactionDate: e.target.value,
                      })
                    }
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
