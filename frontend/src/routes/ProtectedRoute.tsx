import { Navigate, Outlet } from "react-router";

/* ✅ EXPORT LOGOUT FUNCTION */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    logout();
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
