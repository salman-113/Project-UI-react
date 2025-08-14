import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminProtectedRoute = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user && user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminProtectedRoute;