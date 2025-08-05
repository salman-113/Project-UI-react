import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn("Please login to view your orders");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${user.id}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <div key={index} className="border rounded shadow p-4">
              <img
                src={order.image || order.images?.[0] || "/placeholder.jpg"}
                alt={order.name || "Product"}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold text-pink-700">{order.name}</h3>
              <p className="text-gray-600 text-sm capitalize">{order.category}</p>
              <p className="font-bold text-pink-600">₹{order.price}</p>
              <p className="text-sm text-gray-500">Quantity: {order.quantity || 1}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
