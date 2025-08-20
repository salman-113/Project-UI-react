import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

export const AuthContext = createContext({
  user: null,
  isLoading: true,
  loginUser: () => {},
  logoutUser: () => {},
  signupUser: () => {},
  loginUserWithAPI: () => {},
  updateUserPassword: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const signupUser = useCallback(async (form, navigate, toast) => {
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
        password,
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
      console.error("Signup error:", err);
    }
  }, [loginUser]);

  const loginUserWithAPI = useCallback(async (form, navigate, toast) => {
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
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
      console.error("Login error:", err);
    }
  }, [loginUser]);

  const updateUserPassword = useCallback(async (currentPassword, newPassword, toast) => {
    if (!user) {
      toast.error("You must be logged in to change your password");
      return false;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/users?id=${user.id}&password=${currentPassword}`
      );

      if (res.data.length === 0) {
        toast.error("Current password is incorrect");
        return false;
      }

      const updatedUser = {
        ...user,
        password: newPassword
      };

      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        password: newPassword
      });

      loginUser(updatedUser);
      toast.success("Password updated successfully");
      return true;
    } catch (err) {
      toast.error("Failed to update password");
      console.error("Password update error:", err);
      return false;
    }
  }, [user, loginUser]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify the user still exists in the database
          const res = await axios.get(`http://localhost:5000/users?id=${parsedUser.id}`);
          if (res.data.length > 0) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    loginUser,
    logoutUser,
    signupUser,
    loginUserWithAPI,
    updateUserPassword
  }), [
    user,
    isLoading,
    loginUser,
    logoutUser,
    signupUser,
    loginUserWithAPI,
    updateUserPassword
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};