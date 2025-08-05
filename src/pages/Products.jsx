import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiChevronDown, FiAlertCircle } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { user } = useContext(AuthContext);

  const categories = [
    "All",
    "Energy Shots",
    "Sugar-Free",
    "High-Performance",
    "Natural",
    "Limited Edition",
    "Recovery",
    "Hydration"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5000/products", {
          timeout: 5000
        });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from server");
        }

        const activeProducts = response.data.filter(p => p.isActive);
        setProducts(activeProducts);
        setDisplayed(activeProducts);
      } catch (err) {
        setError(err.message || "Failed to load products");
        toast.error(
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            {err.message || "Failed to load products"}
          </div>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter(product => product.category === category);
    }

    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setDisplayed(filtered);
    setCurrentPage(1); // Reset to page 1 on filter/search/sort
  }, [search, category, sort, products]);

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          Please login to add items to cart
        </div>
      );
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users/${user.id}`);
      const existingCart = res.data.cart || [];

      const alreadyInCart = existingCart.find(item => item.id === product.id);
      if (alreadyInCart) {
        toast.info(
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            Item already in cart
          </div>
        );
        return;
      }

      const updatedCart = [...existingCart, { ...product, quantity: 1 }];
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        cart: updatedCart,
      });

      toast.success(
        <div className="flex items-center">
          {product.name} added to cart!
        </div>
      );
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          Failed to add item to cart
        </div>
      );
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayed.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(displayed.length / productsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-[#f4d58d] mb-4"
        >
          ENERGY DRINK COLLECTION
        </motion.h2>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-[#708d81] max-w-2xl mx-auto"
        >
          Premium formulations for maximum performance
        </motion.p>
      </div>

      {/* Search and Filters */}
      <div className="mb-12">
        <div className="relative max-w-xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-[#708d81]" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-[#708d81] rounded-full  text-[#f2e8cf] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#bf0603] focus:border-transparent transition-all duration-300 placeholder-[#708d81]/70"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#001427] border border-[#708d81] rounded-full shadow-sm hover:bg-[#001c3d] transition-colors text-[#f2e8cf]"
          >
            <FiFilter className="h-4 w-4" />
            <span>Filters</span>
            <FiChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full md:w-auto bg-[#001427] p-4 rounded-lg shadow-lg border border-[#708d81]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#f2e8cf] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-[#708d81] focus:outline-none focus:ring-[#bf0603] focus:border-[#bf0603] rounded-md bg-[#001427] text-[#f2e8cf]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} className="bg-[#001427]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f2e8cf] mb-1">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-[#708d81] focus:outline-none focus:ring-[#bf0603] focus:border-[#bf0603] rounded-md bg-[#001427] text-[#f2e8cf]"
                  >
                    <option value="" className="bg-[#001427]">Default</option>
                    <option value="lowToHigh" className="bg-[#001427]">Price: Low to High</option>
                    <option value="highToLow" className="bg-[#001427]">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bf0603]"></div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center bg-[#8d0801] rounded-full p-4 mb-4">
            <FiAlertCircle className="h-8 w-8 text-[#f4d58d]" />
          </div>
          <h3 className="text-xl font-medium text-[#f2e8cf] mb-2">Error loading products</h3>
          <p className="text-[#708d81] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#bf0603] text-[#f2e8cf] rounded-md hover:bg-[#8d0801] transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Empty */}
      {!loading && !error && currentProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <h3 className="text-xl font-medium text-[#f2e8cf] mb-2">No products found</h3>
          <p className="text-[#708d81]">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setSort("");
            }}
            className="mt-4 px-4 py-2 bg-[#bf0603] text-[#f2e8cf] rounded-md hover:bg-[#8d0801] transition-colors"
          >
            Reset Filters
          </button>
        </motion.div>
      )}

      {/* Products */}
      {!loading && !error && currentProducts.length > 0 && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {currentProducts.map((product) => (
            <motion.div 
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                colorPalette={{
                  background: "#001427",
                  text: "#f2e8cf",
                  accent: "#bf0603",
                  secondary: "#708d81",
                  highlight: "#f4d58d"
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === pageNum
                    ? 'bg-[#bf0603] text-[#f2e8cf]'
                    : 'bg-[#001427] text-[#f2e8cf] border-[#708d81]'
                } hover:bg-[#8d0801] transition-all duration-300`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Products;
