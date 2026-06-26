import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children, role = "buyer" }) => {
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);

  if (loading) {
    return <div>Loading</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  //   it the user is buyer it will not go to seller page and vice versa
  // Here is says: TRUE → Agar user role is not role then render children - it is a guard clause
  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default Protected;
