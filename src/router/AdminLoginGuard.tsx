import React from "react";
import {  Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

const AdminLoginGuard = ({ element }: { element: JSX.Element }) => {
    const { admin } = useSelector((state: RootState) => state.admin);
    
    if (admin) {
      return <Navigate to="/admin" />;
    }

    return element;
  };

export default AdminLoginGuard;
