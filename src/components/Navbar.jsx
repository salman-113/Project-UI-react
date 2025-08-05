import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { toast } from "react-toastify";
import { FiUser, FiShoppingCart, FiHeart, FiLogIn, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    toast.info("Logged out successfully!");
    navigate("/login");
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavLinkClass = (path) => {
    return activePage === path ? "text-[#f4d58d] font-bold" : "text-[#708d81] hover:text-[#f4d58d]";
  };

  // Calculate counts from contexts
  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <nav className="bg-[#001427] text-[#708d81] py-4 px-6 relative border-b border-[#708d81]/20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left-aligned company name */}
        <Link 
          to="/" 
          className="text-[#f4d58d] font-bold text-xl tracking-wide"
          onClick={() => setActivePage("/")}
        >
          ENERGY DRINK
        </Link>

        {/* Center-aligned navigation - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <Link 
            to="/" 
            className={getNavLinkClass("/")}
            onClick={() => setActivePage("/")}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={getNavLinkClass("/products")}
            onClick={() => setActivePage("/products")}
          >
            Products
          </Link>
          <Link 
            to="/about" 
            className={getNavLinkClass("/about")}
            onClick={() => setActivePage("/about")}
          >
            About
          </Link>
        </div>

        {/* Right-aligned section */}
        <div className="flex items-center space-x-4">
          {/* Desktop-only icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/wishlist" 
              className={`flex items-center relative ${getNavLinkClass("/wishlist")}`}
              onClick={() => setActivePage("/wishlist")}
            >
              <FiHeart className="mr-1" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#bf0603] text-[#f4d58d] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link 
              to="/cart" 
              className={`flex items-center relative ${getNavLinkClass("/cart")}`}
              onClick={() => setActivePage("/cart")}
            >
              <FiShoppingCart className="mr-1" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#bf0603] text-[#f4d58d] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User/Auth Section */}
          {user ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-1 focus:outline-none"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <FiUser className="text-[#f4d58d]" />
                <span className="hidden md:inline text-[#708d81]">{user.name}</span>
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#001427] border border-[#708d81]/30 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/orders"
                    className={`block px-4 py-2 ${getNavLinkClass("/orders")}`}
                    onClick={() => {
                      setActivePage("/orders");
                      setIsUserDropdownOpen(false);
                    }}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-[#708d81] hover:bg-[#001c3d] hover:text-[#f4d58d]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#f4d58d] hover:bg-[#d4b56a] text-[#001427] px-4 py-2 rounded font-bold flex items-center transition-colors"
              onClick={() => setActivePage("/login")}
            >
              <FiLogIn className="mr-2" />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}

          {/* Mobile menu button - only visible on mobile */}
          <button 
            className="md:hidden text-[#708d81] hover:text-[#f4d58d] focus:outline-none transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#001427] border-t border-[#708d81]/20 absolute top-full left-0 right-0 z-40 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={getNavLinkClass("/")}
              onClick={() => {
                setActivePage("/");
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={getNavLinkClass("/products")}
              onClick={() => {
                setActivePage("/products");
                setIsMobileMenuOpen(false);
              }}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={getNavLinkClass("/about")}
              onClick={() => {
                setActivePage("/about");
                setIsMobileMenuOpen(false);
              }}
            >
              About
            </Link>
            <Link 
              to="/wishlist" 
              className={getNavLinkClass("/wishlist")}
              onClick={() => {
                setActivePage("/wishlist");
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="flex items-center">
                <FiHeart className="mr-2" />
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </div>
            </Link>
            <Link 
              to="/cart" 
              className={getNavLinkClass("/cart")}
              onClick={() => {
                setActivePage("/cart");
                setIsMobileMenuOpen(false);
              }}
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-2" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;