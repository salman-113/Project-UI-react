import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUserX, FiUserCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentIsBlock) => {
    try {
      const newStatus = !currentIsBlock;
      await axios.patch(`http://localhost:5000/users/${userId}`, {
        isBlock: newStatus,
        status: newStatus ? 'blocked' : 'active'
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const toggleExpandUser = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3">{user.id}</td>
                      <td className="p-3 font-medium">
                        {user.name || user.username}
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {user.isBlock ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="p-3 flex justify-end space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.isBlock)}
                          className={`p-2 rounded ${user.isBlock
                            ? 'text-green-500 hover:bg-green-50'
                            : 'text-red-500 hover:bg-red-50'
                            }`}
                          title={user.isBlock ? 'Unblock User' : 'Block User'}
                        >
                          {user.isBlock ? <FiUserCheck /> : <FiUserX />}
                        </button>
                        <button
                          onClick={() => toggleExpandUser(user.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          {expandedUser === user.id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </td>
                    </tr>
                    {expandedUser === user.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-3">User Details</h3>
                              <div className="space-y-2">
                                <p><span className="font-medium">Joined:</span> {formatDate(user.created_at)}</p>
                                <p><span className="font-medium">Status:</span>
                                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {user.isBlock ? 'Blocked' : 'Active'}
                                  </span>
                                </p>
                                {user.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
                                {user.address && <p><span className="font-medium">Address:</span> {user.address}</p>}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-3">Orders ({user.orders?.length || 0})</h3>
                              {user.orders?.length > 0 ? (
                                <div className="space-y-3">
                                  {user.orders.slice(0, 3).map((order) => (
                                    <div key={order.id || order.date} className="border p-3 rounded">
                                      <p className="font-medium">Order #{order.id || 'N/A'}</p>
                                      <p><span className="font-medium">Date:</span> {formatDate(order.date)}</p>
                                      <p><span className="font-medium">Total:</span> ₹{order.total}</p>
                                      <p><span className="font-medium">Status:</span>
                                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${order.status === 'completed'
                                          ? 'bg-green-100 text-green-800'
                                          : order.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                          }`}>
                                          {order.status || 'unknown'}
                                        </span>
                                      </p>
                                    </div>
                                  ))}
                                  {user.orders.length > 3 && (
                                    <p className="text-sm text-gray-500">+ {user.orders.length - 3} more orders</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500">No orders found</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;