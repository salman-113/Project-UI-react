import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return null; 

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
