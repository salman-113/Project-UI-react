import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiBox, FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiActivity } from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
    monthlyGrowth: 0,
    popularCategories: []
    });     

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/users")
        ]);

        let ordersCount = 0;
        let totalRevenue = 0;

        usersRes.data.forEach(user => {
          if (user.orders) {
            ordersCount += user.orders.length;
            user.orders.forEach(order => {
              totalRevenue += order.total || 0;
            });
          }
        });

        const monthlyGrowth = Math.round(Math.random() * 20 - 5);

        const categories = productsRes.data.reduce((acc, product) => {
          const category = product.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const popularCategories = Object.entries(categories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        setStats({
          products: productsRes.data.length,
          users: usersRes.data.length,
          orders: ordersCount,
          revenue: totalRevenue,
          monthlyGrowth,
          popularCategories
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium"><Link to="/admin/products">Total Products</Link></p>
              <h2 className="text-2xl font-bold mt-1">{stats.products}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Link to="/admin/products"><FiBox className="text-blue-500 text-xl" /></Link>

            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">+5.2% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium"><Link to="/admin/users">Total Users</Link></p>
              <h2 className="text-2xl font-bold mt-1">{stats.users}</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Link to="/admin/users"><FiUsers className="text-green-500 text-xl" /></Link>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">+12.7% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium"><Link to="/admin/orders">Total Orders</Link></p>
              <h2 className="text-2xl font-bold mt-1">{stats.orders}</h2>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Link to="/admin/orders"><FiShoppingCart className="text-yellow-500 text-xl" /></Link>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">+8.3% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Revenue</p>
              <h2 className="text-2xl font-bold mt-1">₹ {stats.revenue.toLocaleString()}</h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiDollarSign className="text-purple-500 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {stats.monthlyGrowth >= 0 ? (
              <span className="text-green-500">↑ {stats.monthlyGrowth}% from last month</span>
            ) : (
              <span className="text-red-500">↓ {Math.abs(stats.monthlyGrowth)}% from last month</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-orange-500" />
            Popular Categories
          </h3>
          <ul className="space-y-3">
            {stats.popularCategories.map((category, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{category.name}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  {category.count} products
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiActivity className="mr-2 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FiUsers className="text-green-500" />
              </div>
              <div>
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <FiShoppingCart className="text-yellow-500" />
              </div>
              <div>
                <p className="font-medium">New order received</p>
                <p className="text-sm text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FiBox className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium">New product added</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/products">  <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-lg font-medium transition-colors">
              Add Product
            </button></Link>
            <Link to="/admin/orders"><button className="bg-green-50 hover:bg-green-100 text-green-600 p-3 rounded-lg font-medium transition-colors">
                 View Orders  
            </button></Link>
            <Link to="/admin/users"><button className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-3 rounded-lg font-medium transition-colors">
              Manage Users
            </button></Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;