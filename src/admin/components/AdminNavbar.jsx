import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;