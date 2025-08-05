import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const isInWishlist = wishlist?.some((item) => item.id === id);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.warn("Please login to add to cart");
      return;
    }

    const productWithQty = { ...product, quantity };
    addToCart(productWithQty);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    if (!user) {
      toast.warn("Please login to manage wishlist");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  if (!product) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-96 object-cover rounded shadow"
        />

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold text-pink-700">{product.name}</h2>
          <p className="text-gray-500 mb-1">{product.category}</p>
          <p className="text-pink-600 font-bold text-xl mb-3">₹{product.price}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`border px-4 py-2 rounded ${
                isInWishlist
                  ? "border-pink-600 text-pink-600"
                  : "border-gray-400 text-gray-600 hover:border-pink-600 hover:text-pink-600"
              }`}
            >
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
