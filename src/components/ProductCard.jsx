import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion } from "framer-motion";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  
  // Context hooks with proper null handling
  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);
  
  // Check if contexts are available
  if (!authContext || !cartContext || !wishlistContext) {
    console.error("One or more contexts are not available");
    return null; // Or a loading state
  }
  
  const { user, isLoading } = authContext;
  const { addToCart } = cartContext;
  const { addToWishlist, removeFromWishlist, wishlist } = wishlistContext;

  const isInWishlist = wishlist?.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent default behavior
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
    if (onAddToCart) onAddToCart(product); 
  };

  const handleWishlist = (e) => {
    e.preventDefault(); // This prevents page refresh
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

  // Handle case where product or images might be undefined
  if (!product) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative rounded-xl p-4 overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#001427]/10 to-[#000000]/20 rounded-xl" />

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 cursor-pointer z-10 p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10"
        onClick={handleWishlist}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        type="button" // Explicitly set type to prevent form submission
      >
        {isInWishlist ? (
          <AiFillHeart size={22} className="text-[#bf0603] drop-shadow-lg" />
        ) : (
          <AiOutlineHeart size={22} className="text-[#f4d58d] hover:text-[#bf0603] transition-colors" />
        )}
      </motion.button>

      <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden">
        <motion.img
          src={product.images?.[0] || "/placeholder-image.jpg"} // Fallback for missing image
          alt={product.name || "Product image"}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          loading="lazy" // Lazy load images for better performance
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className="text-lg font-semibold text-[#f4d58d] truncate">
          {product.name || "Unnamed Product"}
        </h3>
        <p className="text-[#708d81] text-sm font-medium">
          {product.category || "Uncategorized"}
        </p>
        <p className="text-[#f2e8cf] font-bold text-lg">
          ₹{product.price?.toFixed(2) || "0.00"}
          <span className="text-[#708d81] text-xs ml-1"> INR</span>
        </p>
      </div>

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
          type="button" // Explicitly set type to prevent form submission
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </motion.button>

        <Link
          to={`/product/${product.id}`}
          className="block text-center text-sm text-[#708d81] hover:text-[#f4d58d] mt-2 transition-colors group"
          aria-label={`View details for ${product.name}`}
        >
          View Details <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;