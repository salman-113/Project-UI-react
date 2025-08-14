import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Signup = () => {
  const { signupUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupUser(form, navigate, toast);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('https://www.apple.com/v/airpods-max/i/images/overview/product-stories/anc/anc_airpod_max_lifestyle__duzobvqwpz42_large_2x.jpg')",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl"
        style={{
          boxShadow: "0 8px 32px 0 rgba(191, 6, 3, 0.2)"
        }}
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "#f4d58d" }}
        >
          Join Us
        </motion.h2>
        
        <form onSubmit={handleSignup} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-#f4d58d placeholder-white/70 text-white"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-#f4d58d placeholder-white/70 text-white"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-#f4d58d placeholder-white/70 text-white"
              required
            />
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#8d0801" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: "#bf0603",
              color: "#f2e8cf",
              boxShadow: "0 4px 14px 0 rgba(191, 6, 3, 0.4)"
            }}
          >
            Create Account
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center mt-6 text-sm"
          style={{ color: "#f2e8cf" }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-semibold hover:underline"
            style={{ color: "#f4d58d" }}
          >
            Login here
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;