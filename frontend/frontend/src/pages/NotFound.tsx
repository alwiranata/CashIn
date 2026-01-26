import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-7xl font-bold text-indigo-600">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </p>
      <p className="mt-2 text-gray-500">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
