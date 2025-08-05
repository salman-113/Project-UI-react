import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wishlist = () => {
  const { user, isLoading } = useContext(AuthContext); // ✅ use isLoading also
  const { wishlist, setWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleMoveToCart = async (product) => {
    if (isLoading) return; // ⏳ Wait for user to load

    if (!user) {
      toast.warn("Please login to add to cart");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const currentCart = res.data.cart || [];
      const currentWishlist = res.data.wishlist || [];

      const alreadyInCart = currentCart.find((item) => item.id === product.id);
      if (alreadyInCart) {
        toast.info("Item already in cart");
        return;
      }

      const updatedCart = [...currentCart, { ...product, quantity: 1 }];
      const updatedWishlist = currentWishlist.filter((item) => item.id !== product.id);

      // ✅ Update backend
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
        wishlist: updatedWishlist,
      });

      // ✅ Update UI states
      setCart(updatedCart);
      setWishlist(updatedWishlist);

      toast.success("Moved to cart");
    } catch (err) {
      console.error("Failed to move to cart", err);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>; // optional loading message
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-pink-600 mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white border rounded shadow p-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold text-pink-700">{product.name}</h3>
              <p className="text-gray-500">{product.category}</p>
              <p className="font-bold text-pink-600 mb-3">₹{product.price}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 text-sm"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="border border-pink-600 text-pink-600 px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
