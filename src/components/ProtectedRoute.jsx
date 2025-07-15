import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Verifica el token en local
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login"/>;
    }

    return children;
};

export default ProtectedRoute;