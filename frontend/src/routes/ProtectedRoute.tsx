import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userRole = user ? JSON.parse(user).role.toLowerCase() : null;

  if (!token) {
    logout();
    return <Navigate to="/signin" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(userRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
