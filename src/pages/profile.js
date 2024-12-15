import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import "../app/globals.css";
import { auth, db } from '../app/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const ordersPerPage = 3; // Limit orders per page
  const router = useRouter();

  const [totalMoneySpent, setTotalMoneySpent] = useState(0); // Initialize with 0

  useEffect(() => {
    document.title = "Shop Mart | Profile Page";
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
  
        // Fetch user details
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          document.title = `Shop Mart | ${userData.firstName} ${userData.lastName}'s Profile`;
        }
  
        // Fetch orders and calculate total money spent
        fetchOrders(user.uid);
        calculateTotalMoneySpent(user.uid); // Call the new function here
      } else {
        setUser(null);
        setOrders([]);
        setTotalMoneySpent(0); // Reset the total if user logs out
      }
    });
  
    return () => unsubscribe();
  }, []);

  const calculateTotalMoneySpent = async (userId) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId) // Match orders for the logged-in user
      );
      const querySnapshot = await getDocs(q);
  
      const totalSpent = querySnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + (data.totalPrice || 0); // Accumulate totalPrice for each order
      }, 0);
  
      setTotalMoneySpent( totalSpent); // Update state with total money spent
    } catch (error) {
      console.error('Error calculating total money spent:', error);
    }
  };

  const fetchOrders = async (userId) => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    // Sort orders by timestamp (newest to oldest)
    const ordersData = querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds); // Sort descending
    
    setOrders(ordersData);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        fetchOrders(userCredential.user.uid);
      })
      .catch((error) => {
        alert('Invalid credentials');
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setUser(userCredential.user);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          firstName: firstName,
          lastName: lastName,
          createdAt: new Date()
        });
        fetchOrders(userCredential.user.uid);
      })
      .catch((error) => {
        alert('Error signing up');
      });
    };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setOrders([]);
      router.push('/');
    }).catch((error) => {
      alert('Error logging out');
    });
  };

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 text-indigo-900 font-sans">
        <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg border-t-4 border-sky-500">
          <h1 className="text-5xl font-extrabold text-sky-700 mb-6 text-center">
            {isSignUp ? 'Sign Up' : 'Login'}
          </h1>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            {isSignUp && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 text-white p-3 rounded-lg shadow-sm hover:bg-sky-600 transition duration-200"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
            <p className="mt-4 text-center">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sky-500 hover:underline transition duration-200"
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sky-500 hover:underline transition duration-200">
                Go to back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-sky-500 text-white py-10 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
          {/* User Info Section */}
          <div className="mb-6 md:mb-0 flex items-center space-x-6">
            <FaUserCircle className="text-6xl text-white-700" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold">
                Welcome, {firstName} {lastName}
              </h1>
              <p className="text-white-300">{user.email}</p>
              {/* Total Money Spent */}
              <p className="text-sm md:text-lg font-medium mt-2">
                Total Money Spent:{" "}
                <span className="bg-sky-100 text-black text-sm md:text-lg py-1 px-3 rounded-md shadow-lg">
                  ₱{totalMoneySpent.toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="space-x-4">
            <Link href="/" className="text-sky-500 hover:underline transition duration-200">
              <button className="bg-blue-900 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-sm hover:bg-blue-600 transition duration-200">
                Go Back to Home
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white  px-2 py-2 md:px-4 md:py-3 rounded-lg shadow-sm hover:bg-red-600 transition duration-200 text-sm"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Orders Section */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 text-indigo-900 font-sans p-8">
        <h2 className="text-2xl font-semibold mt-1 mb-4">
          {orders.length === 0 ? 'You have no orders yet' : 'Your Orders'}
        </h2>
        <ul className="w-full max-w-4xl space-y-6">
          {currentOrders.map((order, index) => (
            <li
              key={index}
              className="p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm md:text-xl font-bold text-indigo-700">Order {startIndex + index + 1}</h3>
                <span className="text-xs md:text-sm text-gray-500">
                  Ordered on: {new Date(order.timestamp.seconds * 1000).toLocaleString()}
                </span>
              </div>
              <ul className="space-y-4">
                {order.cart.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover w-20 h-20"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} | Price: ₱{item.price.toFixed(2) * item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-indigo-700">
                        Total: ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col mt-4 space-y-2 text-sm text-gray-600">
                <p className="font-semibold text-lg text-indigo-800">
                  Total Price: ₱{order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}
                </p>
                <p>Address: {order.address.barangay}, {order.address.district}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {orders.length > ordersPerPage && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-500 text-white hover:bg-sky-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
