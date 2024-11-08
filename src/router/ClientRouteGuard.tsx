import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

function ClientRouteGuard() {
  const { user } = useSelector((state: RootState) => state.user);
  
  return user?.role === "client" ? <Outlet /> : user?.role === "freelancer" ? <Navigate to="/freelancer" /> : null;
 
}

export default ClientRouteGuard;
