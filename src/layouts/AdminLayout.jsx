import AdminNavbar from "../admin/components/AdminNavbar";
import AdminSidebar from "../admin/components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminNavbar />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
