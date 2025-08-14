import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-700">
            Products
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-700">
            Users
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-700">
            Orders
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
