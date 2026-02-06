import { useState } from "react";
import { createPortal } from "react-dom";

type TypeTransaction = "INCOME" | "EXPENSE";

export default function AddTransaction({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState("");

  const [errors, setErrors] = useState<{
    nameTransaction?: string;
    price?: string;
  }>({});

  const [nameTransaction, setNameTransaction] = useState("");
  const [price, setPrice] = useState<string>("");
  const [typeTransaction, setTypeTransaction] =
    useState<TypeTransaction>("INCOME");
  const [transactionDate, setTransactionDate] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");

  function getFileName(pathOrBase64: string) {
    if (!pathOrBase64) return "No file chosen";
    if (pathOrBase64.startsWith("data:image")) return "image.jpg";
    return pathOrBase64.split("/").pop() || "image.jpg";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setApiError("");
    setSuccessMessage("");

    const newErrors: typeof errors = {};

    if (!nameTransaction.trim()) {
      newErrors.nameTransaction = "Transaction name is required";
    }

    const numericPrice = Number(price);

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (Number(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalDate = transactionDate || new Date().toISOString().slice(0, 10);

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/transaction/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameTransaction,
          price: numericPrice, // ✅ NUMBER
          typeTransaction,
          transactionDate: finalDate, // ✅ YYYY-MM-DD
          image: imageBase64 || "", // ✅ NO null
        }),
      });

      if (!res.ok) {
        setApiError("Failed to create transaction");
        setTimeout(() => setApiError(""), 3000);

        return;
      }

      setSuccessMessage("Transaction successfully added");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setOpen(false);
      setNameTransaction("");
      setPrice("");
      setTypeTransaction("INCOME");
      setTransactionDate("");
      setImageFile(null);
      setImageBase64("");

      onSuccess?.();
    } catch (err) {
      setApiError("Failed to add transaction");
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
                Add Transaction
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Transaction Name
                  </label>
                  <input
                    value={nameTransaction}
                    onChange={(e) => {
                      setNameTransaction(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        nameTransaction: undefined,
                      }));
                    }}
                    className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white
    ${errors.nameTransaction ? "border-red-500" : ""}`}
                  />

                  {errors.nameTransaction && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.nameTransaction}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        price: undefined,
                      }));
                    }}
                    className={`w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white
    ${errors.price ? "border-red-500" : ""}`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Type
                  </label>
                  <select
                    value={typeTransaction}
                    onChange={(e) =>
                      setTypeTransaction(e.target.value as TypeTransaction)
                    }
                    className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="INCOME">INCOME</option>
                    <option value="EXPENSE">EXPENSE</option>
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
                    Image
                  </label>

                  <div className="mb-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
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
                        document
                          .getElementById("addTransactionFileInput")
                          ?.click()
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-white"
                    >
                      Upload
                    </button>
                  </div>

                  <input
                    id="addTransactionFileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setImageFile(file);

                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setImageBase64(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
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
