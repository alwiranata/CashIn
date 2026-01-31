import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // belum login
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // sudah login
  return <Outlet />;
}
