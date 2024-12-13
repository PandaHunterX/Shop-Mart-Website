import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../app/firebase';
import "../app/globals.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastVisible, setLastVisible] = useState(null);

  const usersPerPage = 10;

  const fetchUsers = useCallback(async () => {
    try {
      let usersQuery = collection(db, 'users');
      if (searchQuery) {
        usersQuery = query(usersQuery, where('firstName', '>=', searchQuery), where('firstName', '<=', searchQuery + '\uf8ff'));
      }
      usersQuery = query(usersQuery, limit(usersPerPage));

      if (currentPage > 1 && lastVisible) {
        usersQuery = query(usersQuery, startAfter(lastVisible));
      }

      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]);

      // Calculate total pages
      const totalUsersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = totalUsersSnapshot.size;
      setTotalPages(Math.ceil(totalUsers / usersPerPage));
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  }, [currentPage, searchQuery, lastVisible]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, fetchUsers]);

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
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
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white p-2 rounded-lg shadow-sm hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white p-2 rounded-lg shadow-sm hover:bg-gray-600"
            >
              Next
            </button>
          </div>
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
                          {item.name} - Quantity: {item.quantity} - Price: ₱ {item.price.toFixed(2)} - Total: ₱ {(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500">Total Price: ₱ {order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
                    <p className="text-gray-500">Ordered on: {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
                    <p className="text-gray-500">Address: {order.address.district}, {order.address.barangay}</p>
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