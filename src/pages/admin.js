// pages/admin.js
import { useState, useEffect } from 'react';
import "../app/globals.css";
export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const handleOrderStatus = (userId, orderId, status) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedPurchaseHistory = user.purchaseHistory.map(order => {
          if (order.id === orderId) {
            if (status === 'Accepted') {
              const arrivalTime = Math.floor(Math.random() * 60) + 1; // Random time between 1 and 60 minutes
              setTimeout(() => {
                updateOrderStatus(userId, orderId, 'Received');
              }, arrivalTime * 60 * 1000); // Convert minutes to milliseconds
              return { ...order, status, arrivalTime };
            }
            return { ...order, status };
          }
          return order;
        });
        return { ...user, purchaseHistory: updatedPurchaseHistory };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateOrderStatus = (userId, orderId, status) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedPurchaseHistory = user.purchaseHistory.map(order => {
          if (order.id === orderId) {
            return { ...order, status };
          }
          return order;
        });
        return { ...user, purchaseHistory: updatedPurchaseHistory };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleDeleteOrder = (userId, orderId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedPurchaseHistory = user.purchaseHistory.filter(order => order.id !== orderId);
        return { ...user, purchaseHistory: updatedPurchaseHistory };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Users</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="p-2 border-b border-gray-200">
              <h3 className="text-xl font-semibold">{user.name} ({user.email})</h3>
              <h4 className="text-lg font-semibold mt-2">Purchase History</h4>
              {user.purchaseHistory && user.purchaseHistory.length > 0 ? (
                <ul className="space-y-2">
                  {user.purchaseHistory.map((order, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border-b border-gray-200">
                      <div>
                        <span>{order.name} (x{order.quantity})</span>
                        <p className="text-sm text-gray-500">{order.timestamp}</p>
                        <p className="text-sm text-gray-500">Status: {order.status || 'Pending'}</p>
                        {order.status === 'Accepted' && (
                          <p className="text-sm text-gray-500">Arrival in: {order.arrivalTime} minutes</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOrderStatus(user.id, order.id, 'Accepted')}
                          className="bg-green-500 text-white p-1 rounded"
                          disabled={order.status && order.status !== 'Pending'}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleOrderStatus(user.id, order.id, 'Declined')}
                          className="bg-red-500 text-white p-1 rounded"
                          disabled={order.status && order.status !== 'Pending'}
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(user.id, order.id)}
                          className="bg-gray-500 text-white p-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No purchase history available.</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}