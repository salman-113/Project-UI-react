import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

const Signup = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

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
      console.error(err);
      toast.error("Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-pink-600 cursor-pointer underline"
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default Signup;
