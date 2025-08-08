import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebook />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
    { icon: <FaTwitter />, url: "#" }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Cart", path: "/cart" },
    { name: "About", path: "/about" }
  ];

  const contactInfo = [
    { icon: <FaEnvelope />, text: "support@echobay.com" },
    { icon: <FaInstagram />, text: "@Echobay.official" },
    { icon: <FaMapMarkerAlt />, text: "Malappuram, Kerala" }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-[#0a192f] to-[#020617] text-[#708d81]"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-[#f4d58d]">ECHO BAY</h2>
          <p className="leading-relaxed text-[#f2e8cf]/80">
            Premium audio technology for the discerning listener. Experience sound like never before.
          </p>
          <div className="flex space-x-4 pt-2">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                whileHover={{ y: -3, color: "#f4d58d" }}
                href={social.url}
                className="text-[#708d81] hover:text-[#f4d58d] text-xl transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-[#f4d58d] mb-2">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((link, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5 }}
              >
                <Link
                  to={link.path}
                  className="text-[#f2e8cf]/80 hover:text-[#f4d58d] transition-colors flex items-center"
                >
                  <span className="w-2 h-2 bg-[#bf0603] rounded-full mr-3"></span>
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-[#f4d58d] mb-2">Contact Us</h3>
          <div className="space-y-3">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-center text-[#f2e8cf]/80"
              >
                <span className="text-[#bf0603] mr-3">{info.icon}</span>
                <span>{info.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-6 border-t border-[#708d81]/20"
      >
        <p className="text-sm text-[#708d81]">
          &copy; {new Date().getFullYear()} ECHO BAY. All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;