import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div>
          <h2 className="text-lg font-semibold text-pink-600 mb-2">GlamCart</h2>
          <p>Discover stylish tops & outfits for every occasion. Made for women who love fashion & comfort.</p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
            <li><Link to="/products" className="hover:text-pink-600">Products</Link></li>
            <li><Link to="/wishlist" className="hover:text-pink-600">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-pink-600">Cart</Link></li>
            <li><Link to="/about" className="hover:text-pink-600">About</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <p>Email: support@glamcart.com</p>
          <p>Instagram: @glamcart.official</p>
          <p>Malappuram, Kerala</p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center py-4 border-t border-gray-300">
        <p>&copy; {new Date().getFullYear()} GlamCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
