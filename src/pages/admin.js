// pages/admin.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../app/firebase';
import "../app/globals.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => doc.data());
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchOrders(user.id);
  };

  return (
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="mb-2 p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-sky-100"
              >
                <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-500">{user.email}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedUser && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Orders for {selectedUser.firstName} {selectedUser.lastName}</h2>
              <ul>
                {orders.map((order, index) => (
                  <li key={index} className="mb-2 p-4 bg-white shadow rounded-lg">
                    <h3 className="text-xl font-bold">Order {index + 1}</h3>
                    <ul>
                      {order.cart.map((item, idx) => (
                        <li key={idx}>
                          {item.name} - Quantity: {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500">Address: {order.address.barangay}, {order.address.district}</p>
                    <p className="text-gray-500">Ordered on: {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}