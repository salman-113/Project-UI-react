import React from "react";
import { motion } from "framer-motion";

const About = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12 sm:py-16"
    >
      {/* Minimalist header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#f4d58d] mb-3">
          About <span className="text-[#bf0603]">ENERGY DRINK</span>
        </h1>
        <div className="w-20 h-1 bg-[#708d81] mx-auto"></div>
      </motion.div>

      {/* Content blocks */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {/* Mission Block */}
        <motion.div 
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">Our Mission</h2>
          </div>
          <p className="text-[#708d81] pl-4">
            At ENERGY DRINK, we're revolutionizing the energy drink industry with scientifically formulated beverages that deliver clean, sustained energy without the crash. Our products are engineered for those who demand peak performance.
          </p>
        </motion.div>

        {/* Products Block */}
        <motion.div 
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">Our Products</h2>
          </div>
          <p className="text-[#708d81] pl-4 mb-4">
            We specialize in premium energy solutions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
            {[
              "Sugar-Free formulas with natural sweeteners",
              "High-performance caffeine blends",
              "Vitamin-enriched formulations",
              "Electrolyte-infused hydration"
            ].map((product, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-start"
              >
                <div className="w-2 h-2 bg-[#bf0603] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-[#708d81]">{product}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Block */}
        <motion.div 
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">Key Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4">
            {[
              { title: "Enhanced Focus", desc: "Sharper mental clarity for longer periods" },
              { title: "Sustained Energy", desc: "Gradual release without sudden crashes" },
              { title: "Physical Endurance", desc: "Optimized for athletic performance" },
              { title: "Clean Ingredients", desc: "No artificial preservatives or colors" }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-[#708d81]/30 rounded bg-[#001c3d]"
              >
                <h3 className="text-[#f4d58d] font-medium mb-1">{benefit.title}</h3>
                <p className="text-[#708d81] text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Team signature */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 pt-6 border-t border-[#708d81]/20 text-center"
      >
        <p className="text-[#bf0603] font-medium tracking-wider">THE ENERGY DRINK TEAM</p>
        <p className="text-[#708d81] text-sm mt-1">Fueling excellence since 2023</p>
      </motion.div>
    </motion.div>
  );
};

export default About;