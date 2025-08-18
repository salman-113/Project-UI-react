import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const signupUser = async (form, navigate, toast) => {
    const { name, email, password } = form;
    if (!name || !email || !password) {
      toast.warn("All fields are required");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users?email=${email}`);
      if (res.data.length > 0) {
        toast.error("Email already registered");
        return;
      }

      const newUser = {
        id: uuid(),
        name,
        email,
        password, // Note: In a real app, you should hash this password
        role: "user",
        isBlock: false,
        cart: [],
        wishlist: [],
        orders: [],
        created_at: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/users", newUser);
      toast.success("Signup successful");
      loginUser(newUser);
      navigate("/");
    } catch (err) {
      toast.error("Signup failed");
    }
  };

  const loginUserWithAPI = async (form, navigate, toast) => {
    const { email, password } = form;
    if (!email || !password) {
      toast.warn("Please enter email and password");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      if (res.data.length === 0) {
        toast.error("Invalid credentials");
        return;
      }

      const user = res.data[0];
      if (user.isBlock) {
        toast.error("Your account has been blocked");
        return;
      }

      loginUser(user);
      toast.success("Login successful");

      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Login failed");
      console.error(err);
    }
  };

  const updateUserPassword = async (currentPassword, newPassword, toast) => {
    if (!user) {
      toast.error("You must be logged in to change your password");
      return false;
    }

    try {
      // Verify current password
      const res = await axios.get(
        `http://localhost:5000/users?id=${user.id}&password=${currentPassword}`
      );

      if (res.data.length === 0) {
        toast.error("Current password is incorrect");
        return false;
      }

      // Update password
      const updatedUser = {
        ...user,
        password: newPassword // Note: In a real app, you should hash this password
      };

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        password: newPassword
      });

      // Update local user data
      loginUser(updatedUser);
      toast.success("Password updated successfully");
      return true;
    } catch (err) {
      toast.error("Failed to update password");
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loginUser, 
        logoutUser, 
        isLoading, 
        signupUser, 
        loginUserWithAPI,
        updateUserPassword 
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};