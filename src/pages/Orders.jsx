import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiCheckCircle, FiTruck, FiClock } from "react-icons/fi";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      // Use the status from database, don't mock it
      const ordersData = res.data.orders || [];
      setOrders(ordersData.map(order => ({
        ...order,
        trackingNumber: `TRK${Math.floor(100000 + Math.random() * 900000)}`
      })));
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

    fetchOrders();
  }, [user, navigate]);


  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-[#f4d58d] text-[#001427]";
      case "Shipped":
        return "bg-[#6a994e] text-[#f2e8cf]";
      case "In Transit":
        return "bg-[#708d81] text-[#f2e8cf]";
      case "Delivered":
        return "bg-[#386641] text-[#f2e8cf]";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <FiClock className="mr-2" />;
      case "Shipped":
        return <FiPackage className="mr-2" />;
      case "In Transit":
        return <FiTruck className="mr-2" />;
      case "Delivered":
        return <FiCheckCircle className="mr-2" />;
      default:
        return null;
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
    <div className=" mx-auto px-4 py-12 bg-[#001427] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold text-[#f4d58d] mb-2">Order History</h2>
          <div className="w-20 h-1 bg-[#708d81]"></div>
        </div>
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
          <h3 className="text-xl font-medium text-[#f2e8cf] mb-2">
            No orders yet
          </h3>
          <p className="text-[#708d81] mb-6">
            Your order history will appear here
          </p>
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
          {orders
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest first
            .map((order, index) => (
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
                        Placed on {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items?.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start space-x-4 p-4 bg-[#001427] rounded-lg border border-[#708d81]/20"
                      >
                        <div className="flex-shrink-0 w-24 h-24 bg-[#001427] rounded overflow-hidden border border-[#708d81]/30">
                          <img
                            src={
                              item.image ||
                              item.images?.[0] ||
                              "/placeholder.jpg"
                            }
                            alt={item.name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-[#f2e8cf]">
                            {item.name}
                          </h4>
                          <p className="text-[#708d81] text-sm capitalize">
                            {item.category}
                          </p>
                          <p className="text-[#f4d58d] font-bold mt-1">
                            ₹{item.price ? item.price.toLocaleString("en-IN") : "0.00"}
                          </p>
                          <p className="text-[#708d81] text-sm">
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#f2e8cf]">
                            ₹
                            {item.price && item.quantity
                              ? (item.price * item.quantity).toLocaleString("en-IN")
                              : "0.00"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#708d81]/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium text-[#708d81] mb-1">
                          Shipping Address
                        </h5>
                        <p className="text-[#f2e8cf] text-sm">
                          {order.shipping?.address || "N/A"},{" "}
                          {order.shipping?.city || "N/A"},{" "}
                          {order.shipping?.state || "N/A"},{" "}
                          {order.shipping?.zip || "N/A"}
                        </p>
                        <p className="text-[#708d81] text-sm mt-1">
                          Payment Method:{" "}
                          <span className="text-[#f4d58d] capitalize">
                            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <h5 className="text-sm font-medium text-[#708d81] mb-1">
                          Order Total
                        </h5>
                        <p className="text-xl font-bold text-[#f4d58d]">
                          ₹{order.total ? order.total.toLocaleString("en-IN") : "0.00"}
                          {order.paymentMethod === "cod" && (
                            <span className="text-sm text-[#708d81] ml-2">
                              (includes ₹50 COD charge)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default Orders;