import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`http://localhost:5000/users/${user.id}`);
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user) return;

    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const currentWishlist = res.data.wishlist || [];

      const exists = currentWishlist.find((item) => item.id === product.id);
      if (exists) return;

      const updatedWishlist = [...currentWishlist, product];

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      setWishlist(updatedWishlist);
    } catch (err) {
      console.error("Failed to add to wishlist", err);
    }
  };

  const removeFromWishlist = async (id) => {
    if (!user) return;

    try {
      const updatedWishlist = wishlist.filter((item) => item.id !== id);
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        wishlist: updatedWishlist,
      });
      setWishlist(updatedWishlist);
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        wishlist: [],
      });
      setWishlist([]);
    } catch (err) {
      console.error("Failed to clear wishlist", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
