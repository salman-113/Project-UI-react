import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const userCart = res.data.cart || [];
      setCart(userCart);
    } catch (err) {
      console.error("Failed to load cart", err);
      toast.error("Failed to load cart");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const syncCartToDB = useCallback(async (updatedCart) => {
    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
      });
    } catch (err) {
      toast.error("Cart update failed");
    }
  }, [user]);

  const addToCart = useCallback(
    async (product, event) => {
      // Prevent default behavior to avoid page refresh
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      
      setCart((prevCart) => {
        const exists = prevCart.find((item) => item.id === product.id);
        if (exists) {
          toast.info("Item already in cart");
          return prevCart;
        }
        const updatedCart = [...prevCart, { ...product, quantity: 1 }];
        syncCartToDB(updatedCart);
        toast.success("Added to cart");
        return updatedCart;
      });
    },
    [syncCartToDB]
  );

  const removeFromCart = useCallback(
    (id, event) => {
      // Prevent default behavior to avoid page refresh
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== id);
        syncCartToDB(updatedCart);
        toast.success("Removed from cart");
        return updatedCart;
      });
    },
    [syncCartToDB]
  );

  const clearCart = useCallback((event) => {
    // Prevent default behavior to avoid page refresh
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
    setCart([]);
    syncCartToDB([]);
    toast.success("Cart cleared");
  }, [syncCartToDB]);

  const incrementQty = useCallback(
    (id, event) => {
      // Prevent default behavior to avoid page refresh
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        syncCartToDB(updatedCart);
        return updatedCart;
      });
    },
    [syncCartToDB]
  );

  const decrementQty = useCallback(
    (id, event) => {
      // Prevent default behavior to avoid page refresh
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      
      setCart((prevCart) => {
        const updatedCart = prevCart.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        const isChanged = prevCart.some(
          (item, index) => item.quantity !== updatedCart[index]?.quantity
        );
        if (isChanged) {
          syncCartToDB(updatedCart);
          return updatedCart;
        }
        return prevCart;
      });
    },
    [syncCartToDB]
  );

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const contextValue = useMemo(() => ({
    loading,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    incrementQty,
    decrementQty,
    totalPrice,
  }), [loading, cart, addToCart, removeFromCart, clearCart, incrementQty, decrementQty, totalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};