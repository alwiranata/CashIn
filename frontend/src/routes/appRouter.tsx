import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardLayout from "@/layout/DashaboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      {/* redirect "/" ke login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
