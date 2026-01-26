import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardLayout from "@/layout/DashaboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";
import User from "@/pages/User";
import Transactions from "@/pages/Transactions";
import Task from "@/pages/Tasks";
import Dashboard from "@/pages/Dashboard";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔐 DASHBOARD (NESTED ROUTE) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="task" element={<Task />} />
        <Route path="transaction" element={<Transactions />} />
        <Route path="user" element={<User />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
