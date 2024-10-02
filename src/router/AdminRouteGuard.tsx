import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

function AdminRouteGuard() {
  const { admin } = useSelector((state: RootState) => state.admin);

  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default AdminRouteGuard;
