import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

function FreelancerRouteGuard() {
  const { user } = useSelector((state: RootState) => state.user);
  
  if (user?.isFreelancerBlock) {
    return <Navigate to="/home" />;
  }
  return user?.role === "freelancer" ? <Outlet /> : user?.role === "client" ? <Navigate to="/home" /> :  <Navigate to="/"/>;

 
}

export default FreelancerRouteGuard;
