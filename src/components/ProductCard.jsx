import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion } from "framer-motion";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const isInWishlist = wishlist?.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!user && !isLoading) {
      toast.warn(
        <div className="flex items-center text-[#f2e8cf]">
          <span className="mr-2">⚠️</span> Please login to add items to cart
        </div>
      );
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(
      <div className="flex items-center text-[#f2e8cf]">
        <span className="mr-2">✓</span> Added to cart!
      </div>
    );
    if (onAddToCart) onAddToCart(product);
  };

  const handleWishlist = () => {
    if (!user && !isLoading) {
      toast.warn(
        <div className="flex items-center text-[#f2e8cf]">
          <span className="mr-2">⚠️</span> Please login to manage wishlist
        </div>
      );
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info(
        <div className="flex items-center text-[#f2e8cf]">
          <span className="mr-2">ℹ️</span> Removed from wishlist
        </div>
      );
    } else {
      addToWishlist(product);
      toast.success(
        <div className="flex items-center text-[#f2e8cf]">
          <span className="mr-2">✓</span> Added to wishlist
        </div>
      );
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#001427] border border-[#708d81]/30 rounded-lg shadow-lg hover:shadow-xl transition-all p-4 relative"
    >
      {/* Wishlist Heart Icon */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 cursor-pointer z-10"
        onClick={handleWishlist}
      >
        {isInWishlist ? (
          <AiFillHeart size={22} className="text-[#bf0603]" />
        ) : (
          <AiOutlineHeart size={22} className="text-[#708d81] hover:text-[#bf0603]" />
        )}
      </motion.div>

      {/* Product Image */}
      <div className="overflow-hidden rounded mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-[#f4d58d] truncate">{product.name}</h3>
        <p className="text-[#708d81] text-sm">{product.category}</p>
        <p className="text-[#f2e8cf] font-bold">${product.price.toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-[#bf0603] text-[#f2e8cf] px-3 py-2 rounded hover:bg-[#8d0801] transition-colors text-sm font-medium"
        >
          Add to Cart
        </motion.button>

        <Link
          to={`/product/${product.id}`}
          className="block text-center text-sm text-[#708d81] hover:text-[#f4d58d] mt-2 transition-colors"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;