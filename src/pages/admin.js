import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit, where, startAfter, doc } from 'firebase/firestore';
import { db } from '../app/firebase';
import "../app/globals.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 5;

  const [totalSales, setTotalSales] = useState(0);
  const [dailySales, setDailySales] = useState({});
  const [totalOrders, setTotalOrders] = useState(0);
  const [uniqueCustomers, setUniqueCustomers] = useState(0);
  const [customerRanking, setCustomerRanking] = useState([]);

  const [currentTab, setCurrentTab] = useState('recentOrders'); // 'recentOrders', 'users', 'sales'

  const fetchRecentOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const recentOrdersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { id: doc.id, ...doc.data() };
        return acc;
      }, {});
  
      // Attach user data to each order
      const ordersWithUserData = recentOrdersData.map(order => ({
        ...order,
        user: usersData[order.userId] || null, // Add user data or null if not found
      }));
  
      setRecentOrders(ordersWithUserData);
    } catch (error) {
      console.error("Error fetching recent orders: ", error);
    }
  };

  const fetchAllUsers = useCallback(async () => {
    try {
      let usersQuery = collection(db, "users");
      if (searchQuery) {
        usersQuery = query(
          usersQuery,
          where("firstName", ">=", searchQuery),
          where("firstName", "<=", searchQuery + "\uf8ff")
        );
      }
      usersQuery = query(usersQuery, limit(usersPerPage));

      if (currentPage > 1 && lastVisible) {
        usersQuery = query(usersQuery, startAfter(lastVisible));
      }

      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]);

      // Calculate total pages
      const totalUsersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = totalUsersSnapshot.size;
      setTotalPages(Math.ceil(totalUsers / usersPerPage));
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  }, [currentPage, searchQuery, lastVisible]);

  const fetchOrders = async (userId) => {
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => doc.data());
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  }

  const fetchSalesData = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Calculate total sales
      const total = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      setTotalSales(total);
  
      // Calculate sales per day
      const salesPerDay = {};
      allOrders.forEach(order => {
        const date = new Date(order.timestamp.seconds * 1000).toLocaleDateString();
        salesPerDay[date] = (salesPerDay[date] || 0) + order.totalPrice;
      });
      setDailySales(salesPerDay);
  
      // Total number of orders
      setTotalOrders(allOrders.length);
  
      // Calculate unique customers
      const uniqueCustomerIds = new Set(allOrders.map(order => order.userId));
      setUniqueCustomers(uniqueCustomerIds.size);
  
      // Ranking customers based on total spending
      const customerSpendings = {};
      allOrders.forEach(order => {
        const userId = order.userId;
        customerSpendings[userId] = (customerSpendings[userId] || 0) + order.totalPrice;
      });
  
      // Sort customers by spending in descending order
      const sortedRanking = Object.entries(customerSpendings)
        .map(([userId, totalSpent]) => ({ userId, totalSpent }))
        .sort((a, b) => b.totalSpent - a.totalSpent);
  
      // Fetch user details for ranking
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { id: doc.id, ...doc.data() };
        return acc;
      }, {});
  
      const rankedCustomers = sortedRanking.map(ranking => ({
        ...usersData[ranking.userId],
        totalSpent: ranking.totalSpent,
      }));
  
      // Slice the top 5 spenders
      setCustomerRanking(rankedCustomers.slice(0, 5));
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchOrders(user.id);
  };

  useEffect(() => {
    document.title = "Shop Mart | Admin Panel";
    fetchRecentOrders();
    fetchAllUsers();
    fetchSalesData();
  }, [fetchAllUsers]);

  return (
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans p-8">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-8 text-center">Admin Panel</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setCurrentTab('recentOrders')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentTab === 'recentOrders' ? 'bg-sky-500 text-white' : 'bg-gray-200'
          }`}
        >
          Recent Orders
        </button>
        <button
          onClick={() => setCurrentTab('users')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentTab === 'users' ? 'bg-sky-500 text-white' : 'bg-gray-200'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setCurrentTab('sales')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentTab === 'sales' ? 'bg-sky-500 text-white' : 'bg-gray-200'
          }`}
        >
          Sales Overview
        </button>
      </div>

      {/* Recent Orders */}
      {currentTab === 'recentOrders' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-sky-600">Recent Orders</h2>
          <ul className="space-y-4">
            {recentOrders.map((order, index) => (
              <li
                key={index}
                className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  Ordered by {order.user ? `${order.user.firstName} ${order.user.lastName}` : "Unknown User"}
                </h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  {order.cart.map((item, idx) => (
                    <li key={idx}>
                      {item.name} - Quantity: {item.quantity} - Price: ₱{item.price.toFixed(2)} - Total: ₱{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-500">
                  <span className="font-semibold">Total Price:</span> ₱{order.totalPrice.toFixed(2)}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Ordered on:</span>{" "}
                  {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address.barangay}, {order.address.district}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Users */}
      {currentTab === "users" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-sky-600">Users</h2>
            <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder="🔍 Search by name"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="mb-3 p-4 border rounded-lg shadow cursor-pointer hover:bg-sky-100"
                >
                  <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Orders for Selected User */}
          <div className="bg-white p-6 rounded-lg shadow-md">
          {selectedUser ? (
            <>
              <h2 className="text-2xl font-bold mb-4 text-sky-600">
                Orders for {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <ul className="space-y-4">
                {orders.map((order, index) => (
                  <li
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-indigo-700">
                      Order #{index + 1}
                    </h3>
                    <ul className="text-gray-600 text-sm space-y-1 mb-3">
                      {order.cart.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-medium text-gray-800">{item.name}</span> - Quantity: {item.quantity} - Price: ₱{item.price.toFixed(2)} - Total: ₱{(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500">
                      <span className="font-semibold">Total Price:</span> ₱{order.totalPrice ? order.totalPrice.toFixed(2) : "N/A"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold">Ordered on:</span> {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-semibold">Address:</span> {order.address.barangay}, {order.address.district}
                    </p>
                  </li>
                ))}
              </ul>
            </>
            ) : (
              <p>Select a user to view their orders 🧾</p>
            )}
          </div>
        </div>
      )}

      {/* Sales Overview */}
      {currentTab === 'sales' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-sky-600">Sales Overview</h2>
          <p className="text-xl font-semibold mb-4">
            Total Sales: ₱{totalSales.toFixed(2)}
          </p>
          <p className="text-lg font-medium mb-4">
            Total Orders: {totalOrders}
          </p>
          <p className="text-lg font-medium mb-4">
            Total Customers: {uniqueCustomers}
          </p>

          <h3 className="text-lg font-semibold mb-2">Sales Per Day</h3>
          <ul className="mb-8">
            {Object.keys(dailySales).map(date => (
              <li key={date} className="p-2 border-b text-gray-700">
                {date}: ₱{dailySales[date].toFixed(2)}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mb-2">Top 5 Highest Spenders</h3>
          <ul>
            {customerRanking.map((customer, index) => (
              <li
                key={customer.id}
                className="p-4 mb-2 border rounded-lg shadow hover:shadow-lg transition-all"
              >
                <h4 className="text-indigo-700 font-medium">
                  #{index + 1} {customer.firstName} {customer.lastName}
                </h4>
                <p className="text-gray-600">Email: {customer.email}</p>
                <p className="text-gray-600 font-medium">
                  Total Spent: ₱{customer.totalSpent.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}