// import React from "react";
// import { Outlet, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../state/store";

// function ClientRouteGuard() {
//   const { user } = useSelector((state: RootState) => state.user);
  
//   return user?.role === "client" ? <Outlet /> : user?.role === "freelancer" ? <Navigate to="/freelancer" /> : null;
 
// }

// export default ClientRouteGuard;


import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { userLogout } from "../state/slices/userSlice";
const ClientRouteGuard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user?.isBlock) {
      dispatch(userLogout());
    }
  }, [user?.isBlock, dispatch]);

  if (user?.isBlock) {
    return <Navigate to="/" />;
  }

  if (user?.role === "client") {
    return <Outlet />;
  } else if (user?.role === "freelancer") {
    return <Navigate to="/freelancer" />;
  }

  return <Navigate to="/" />;
};

export default ClientRouteGuard;
