import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// User Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import UserSettings from "./pages/UserSettings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminUsers from "./admin/pages/AdminUsers";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <ToastContainer 
        position="bottom-left" 
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {user?.role === "admin" ? (
        <AdminLayout>
          <Routes>
            <Route element={<AdminProtectedRoute />}>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AdminLayout>
      ) : (
        <UserLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/success" element={<Success />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<UserSettings />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserLayout>
      )}
    </Router>
  );
};

export default App;