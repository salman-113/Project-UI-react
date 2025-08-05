import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearCart, totalPrice } = useContext(CartContext);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn("Please login to checkout");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      toast.warn("Please fill all payment fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const existingUser = res.data;
      const updatedOrders = [...(existingUser.orders || []), ...cart];

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        orders: updatedOrders,
        cart: [],
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/success");
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-pink-600 mb-8">Checkout</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 🧾 Order Summary */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-pink-600">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <p className="text-lg font-bold">
                Total: <span className="text-pink-600">₹{totalPrice}</span>
              </p>
            </div>
          </div>

          {/* 💳 Payment + Shipping */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Shipping & Payment</h3>

            {/* User Info */}
            <div className="bg-gray-100 p-4 rounded mb-6">
              <p className="text-gray-700 font-medium">Name: {user?.name || "Guest"}</p>
              <p className="text-gray-700 font-medium">Email: {user?.email || "N/A"}</p>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={paymentInfo.expiry}
                  onChange={handleInputChange}
                  className="w-1/2 px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={handleInputChange}
                  className="w-1/2 px-4 py-2 border rounded"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded font-semibold"
              >
                {loading ? "Processing..." : "Place Order ₹" + totalPrice}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
