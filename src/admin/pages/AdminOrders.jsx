import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiCheck, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/users");
      const allOrders = [];
      res.data.forEach((user) => {
        if (user.orders && user.orders.length > 0) {
          user.orders.forEach((order) => {
            const orderId = order.id || `${user.id}-${order.date}`;
            allOrders.push({
              ...order,
              id: orderId,
              userId: user.id,
              user: user.name || user.username,
              userEmail: user.email
            });
          });
        }
      });
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEditingStatus = (orderId, currentStatus) => {
    setEditingStatus(orderId);
    setTempStatus(currentStatus);
  };

  const cancelEditingStatus = () => {
    setEditingStatus(null);
    setTempStatus("");
  };

  const updateOrderStatus = async (orderId, userId) => {
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = userRes.data;
      
      const updatedOrders = user.orders.map(order => {
        const currentOrderId = order.id || `${userId}-${order.date}`;
        return currentOrderId === orderId ? { ...order, status: tempStatus } : order;
      });

      await axios.patch(`http://localhost:5000/users/${userId}`, {
        orders: updatedOrders
      });

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: tempStatus } : order
      ));
      
      setEditingStatus(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const toggleExpandOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned"
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3">#{order.id}</td>
                      <td className="p-3 font-medium">{order.user}</td>
                      <td className="p-3">₹{order.total}</td>
                      <td className="p-3">{formatDate(order.date)}</td>
                      <td className="p-3">
                        {editingStatus === order.id ? (
                          <select
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value)}
                            className="border rounded p-1 text-sm"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'cancelled' || order.status === 'returned'
                                ? 'bg-red-100 text-red-800'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex justify-end space-x-2">
                        {editingStatus === order.id ? (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, order.userId)}
                              className="p-1 text-green-500 hover:bg-green-50 rounded"
                              title="Save"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={cancelEditingStatus}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditingStatus(order.id, order.status)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit Status"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => toggleExpandOrder(order.id)}
                              className="p-1 text-purple-500 hover:bg-purple-50 rounded"
                              title="View Details"
                            >
                              {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-3">Order Details</h3>
                              <div className="space-y-2">
                                <p><span className="font-medium">User:</span> {order.user}</p>
                                <p><span className="font-medium">Email:</span> {order.userEmail}</p>
                                <p><span className="font-medium">Order Date:</span> {formatDate(order.date)}</p>
                                <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || 'Unknown'}</p>
                                {order.shipping && (
                                  <>
                                    <p><span className="font-medium">Shipping Address:</span> {order.shipping.address}</p>
                                    <p><span className="font-medium">City:</span> {order.shipping.city}</p>
                                    <p><span className="font-medium">State:</span> {order.shipping.state}</p>
                                    <p><span className="font-medium">ZIP:</span> {order.shipping.zip}</p>
                                  </>
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-3">Items ({order.items?.length || 0})</h3>
                              {order.items?.length > 0 ? (
                                <div className="space-y-3">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex items-start border-b pb-3">
                                      <img
                                        src={item.images?.[0]}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded mr-3"
                                      />
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p>₹{item.price} x {item.quantity}</p>
                                        <p>Subtotal: ₹{item.price * item.quantity}</p>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="pt-2">
                                    <p className="font-medium text-lg">Total: ₹{order.total}</p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-500">No items found</p>
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
                    No orders found
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

export default AdminOrders;