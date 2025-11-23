import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const mecanico = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");

  if (!mecanico) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
