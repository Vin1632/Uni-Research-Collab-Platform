import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../contexts/AuthContext";

export default function PrivateRoute() {
  const { currentUser } = useUserAuth();

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
