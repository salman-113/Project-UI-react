import { motion } from "framer-motion";

const About = () => {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-[#f4d58d] mb-3">
          About <span className="text-[#bf0603]">ECHO BAY</span>
        </h1>
        <div className="w-20 h-1 bg-[#708d81] mx-auto"></div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        <motion.div
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">Our Mission</h2>
          </div>
          <p className="text-[#708d81] pl-4">
            At ECHO BAY, we redefine audio excellence with precision-engineered headsets that deliver studio-quality sound for everyday use. Our products are crafted for audiophiles, gamers, and professionals who demand acoustic perfection.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">Our Products</h2>
          </div>
          <p className="text-[#708d81] pl-4 mb-4">
            We specialize in premium audio solutions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
            {[
              "Noise-canceling wireless headsets",
              "High-fidelity studio monitors",
              "Competitive gaming headsets",
              "Professional conference audio gear"
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

        <motion.div
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">Core Technologies</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4">
            {[
              { title: "Acoustic Precision", desc: "40mm graphene drivers for crystal clarity" },
              { title: "Active Noise Canceling", desc: "Industry-leading 35dB reduction" },
              { title: "Battery Life", desc: "Up to 50 hours of continuous playback" },
              { title: "Materials", desc: "Aerospace-grade aluminum and memory foam" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-[#708d81]/30 rounded bg-[#001c3d]"
              >
                <h3 className="text-[#f4d58d] font-medium mb-1">{tech.title}</h3>
                <p className="text-[#708d81] text-sm">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          variants={item}
          className="p-6 border-2 border-[#708d81] rounded-lg bg-[#001427]/80 backdrop-blur-sm"
        >
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-[#bf0603] mr-3 mt-1"></div>
            <h2 className="text-xl font-semibold text-[#f4d58d]">The Echo Bay Experience</h2>
          </div>
          <div className="pl-4">
            <p className="text-[#708d81] mb-4">
              Every Echo Bay headset undergoes 200+ quality checks and 50 hours of acoustic tuning before reaching you. Our proprietary SoundSphere™ technology creates a 360° soundstage that reveals details most headsets miss.
            </p>
            <div className="flex flex-wrap gap-2">
              {["3D Audio", "Hi-Res Certified", "Bluetooth 5.3", "IPX4 Water Resistant"].map((feature, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-[#bf0603]/20 text-[#f4d58d] rounded-full text-xs"
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 pt-6 border-t border-[#708d81]/20 text-center"
      >
        <p className="text-[#bf0603] font-medium tracking-wider">THE ECHO BAY TEAM</p>
        <p className="text-[#708d81] text-sm mt-1">Engineering perfect sound since 2018</p>
      </motion.div>
    </motion.div>
  );
};

export default About; 