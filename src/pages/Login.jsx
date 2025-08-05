import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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

      loginUser(user); // store user in context + localStorage
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
          Login
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-pink-600 cursor-pointer underline"
        >
          Signup here
        </span>
      </p>
    </div>
  );
};

export default Login;
