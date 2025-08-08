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
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, logoutUser, isLoading, signupUser, loginUserWithAPI }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
