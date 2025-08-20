import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);

  // Check if context is available
  if (!authContext) {
    console.error("AuthContext is not available");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001427]">
        <div className="text-red-500 p-4 bg-[#001c3d] rounded-lg">
          Authentication system error. Please refresh the page.
        </div>
      </div>
    );
  }

  const { user, isLoading } = authContext;

  // Show unauthorized message if user tries to access protected route
  useEffect(() => {
    if (!isLoading && !user && location.pathname !== "/login") {
      toast.warn(
        <div className="flex items-center text-[#f4d58d]">
          <span className="mr-2">🔒</span> Please login to access this page
        </div>
      );
    }
  }, [user, isLoading, location.pathname]);

  // Show a proper loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001427]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4d58d] mx-auto mb-4"></div>
          <p className="text-[#708d81]">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login with return url
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;