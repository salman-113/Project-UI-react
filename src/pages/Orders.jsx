import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiCheckCircle, FiTruck, FiClock } from "react-icons/fi";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn(
        <div className="flex items-center text-[#f2e8cf]">
          <span className="mr-2">⚠️</span> Please login to view your orders
        </div>
      );
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/users/${user.id}`);
        const ordersWithStatus = (res.data.orders || []).map(order => ({
          ...order,
          status: mockOrderStatus(order.orderDate),
          trackingNumber: `TRK${Math.floor(100000 + Math.random() * 900000)}`
        }));
        setOrders(ordersWithStatus);
      } catch (err) {
        toast.error(
          <div className="flex items-center text-[#f2e8cf]">
            <span className="mr-2">✕</span> Failed to fetch orders
          </div>
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const mockOrderStatus = (orderDate) => {
    const daysPassed = Math.floor((new Date() - new Date(orderDate)) / (1000 * 60 * 60 * 24));
    if (daysPassed < 1) return "Processing";
    if (daysPassed < 2) return "Shipped";
    if (daysPassed < 4) return "In Transit";
    return "Delivered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-[#f4d58d] text-[#001427]";
      case "Shipped": return "bg-[#6a994e] text-[#f2e8cf]";
      case "In Transit": return "bg-[#708d81] text-[#f2e8cf]";
      case "Delivered": return "bg-[#386641] text-[#f2e8cf]";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <FiClock className="mr-2" />;
      case "Shipped": return <FiPackage className="mr-2" />;
      case "In Transit": return <FiTruck className="mr-2" />;
      case "Delivered": return <FiCheckCircle className="mr-2" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf0603]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-[#001427] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold text-[#f4d58d] mb-2">Order History</h2>
        <div className="w-20 h-1 bg-[#708d81]"></div>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-block p-6 bg-[#001c3d] rounded-full mb-6">
            <FiPackage className="h-12 w-12 text-[#708d81]" />
          </div>
          <h3 className="text-xl font-medium text-[#f2e8cf] mb-2">No orders yet</h3>
          <p className="text-[#708d81] mb-6">Your order history will appear here</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-[#bf0603] hover:bg-[#8d0801] text-[#f2e8cf] rounded-lg font-medium transition-colors"
          >
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {orders.map((order, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#001c3d] rounded-lg shadow-lg overflow-hidden border border-[#708d81]/30"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#f4d58d]">
                      Order #{order.trackingNumber}
                    </h3>
                    <p className="text-[#708d81] text-sm">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-24 h-24 bg-[#001427] rounded overflow-hidden border border-[#708d81]/30">
                        <img
                          src={order.image || order.images?.[0] || "/placeholder.jpg"}
                          alt={order.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#f2e8cf]">{order.name}</h4>
                        <p className="text-[#708d81] text-sm capitalize">{order.category}</p>
                        <p className="text-[#f4d58d] font-bold mt-1">${order.price.toFixed(2)}</p>
                        <p className="text-[#708d81] text-sm">Quantity: {order.quantity || 1}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-[#708d81] mb-1">Order Total</h5>
                      <p className="text-xl font-bold text-[#f4d58d]">
                        ${(order.price * (order.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-[#708d81] mb-1">Shipping Address</h5>
                      <p className="text-[#f2e8cf] text-sm">
                        {order.shippingAddress || "123 Main St, City, Country"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#001427] px-6 py-3 border-t border-[#708d81]/20 flex justify-end">
                <button className="text-sm font-medium text-[#f4d58d] hover:text-[#bf0603] transition-colors">
                  View Order Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Orders;