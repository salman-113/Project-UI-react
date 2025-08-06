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
        <div className="flex items-center text-[#f4d58d]">
          <span className="mr-2">⚠️</span> Please login to add items to cart
        </div>
      );
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(
      <div className="flex items-center text-[#f4d58d]">
        <span className="mr-2">✓</span> Added to cart!
      </div>
    );
    if (onAddToCart) onAddToCart(product);
  };

  const handleWishlist = () => {
    if (!user && !isLoading) {
      toast.warn(
        <div className="flex items-center text-[#f4d58d]">
          <span className="mr-2">⚠️</span> Please login to manage wishlist
        </div>
      );
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info(
        <div className="flex items-center text-[#f4d58d]">
          <span className="mr-2">♥</span> Removed from wishlist
        </div>
      );
    } else {
      addToWishlist(product);
      toast.success(
        <div className="flex items-center text-[#f4d58d]">
          <span className="mr-2">✓</span> Added to wishlist
        </div>
      );
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative rounded-xl p-4 overflow-hidden"
    >
      {/* Pure Glass Background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001427]/10 to-[#000000]/20 rounded-xl" />

      {/* Wishlist Heart Icon */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 cursor-pointer z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10"
        onClick={handleWishlist}
      >
        {isInWishlist ? (
          <AiFillHeart size={22} className="text-[#bf0603] drop-shadow-lg" />
        ) : (
          <AiOutlineHeart size={22} className="text-[#f4d58d] hover:text-[#bf0603] transition-colors" />
        )}
      </motion.div>

      {/* Product Image - Square aspect ratio */}
      <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        {/* Image glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
      </div>

      {/* Product Info */}
      <div className="relative z-10 space-y-2">
        <h3 className="text-lg font-semibold text-[#f4d58d] truncate">{product.name}</h3>
        <p className="text-[#708d81] text-sm font-medium">{product.category}</p>
        <p className="text-[#f2e8cf] font-bold text-lg">
          ${product.price.toFixed(2)}
          <span className="text-[#708d81] text-xs ml-1">USD</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-4 space-y-2">
        <motion.button
          whileHover={{ 
            scale: 1.02,
            background: "linear-gradient(135deg, #bf0603 0%, #8d0801 100%)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          style={{
            background: "linear-gradient(135deg, #8d0801 0%, #bf0603 100%)"
          }}
          className="w-full text-[#f2e8cf] px-3 py-2 rounded-md hover:shadow-lg transition-all text-sm font-medium shadow-md"
        >
          Add to Cart
        </motion.button>

        <Link
          to={`/product/${product.id}`}
          className="block text-center text-sm text-[#708d81] hover:text-[#f4d58d] mt-2 transition-colors group"
        >
          View Details <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;