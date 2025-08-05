import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    totalPrice,
    removeFromCart,
    clearCart,
    incrementQty,
    decrementQty,
    loading,
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (loading) return <p className="text-center mt-10">Loading your cart...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-2/3">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className="font-bold text-pink-600">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementQty(item.id)}
                    className="px-2 py-1 border rounded text-lg"
                  >
                    −
                  </button>
                  <span className="text-md font-medium">{item.quantity}</span>
                  <button
                    onClick={() => incrementQty(item.id)}
                    className="px-2 py-1 border rounded text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">
              Total: <span className="text-pink-600">₹{totalPrice}</span>
            </p>
            <button
              onClick={clearCart}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 bg-pink-600 hover:bg-pink-700 text-white w-full py-3 rounded text-lg font-semibold"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
