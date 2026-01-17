import { Navigate } from "react-router-dom";
import { getToken } from "@/utils/storage";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
