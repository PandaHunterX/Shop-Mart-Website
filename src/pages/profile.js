// pages/profile.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import "../app/globals.css";
import { auth, db } from '../app/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchOrders(user.uid);
      } else {
        setUser(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async (userId) => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const ordersData = querySnapshot.docs.map(doc => doc.data());
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

  if (!user) {
    return (
      <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans">
        <h1 className="text-5xl font-extrabold text-sky-700 mb-6">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h1>
        <form
          onSubmit={isSignUp ? handleSignUp : handleLogin}
          className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg border-t-4 border-sky-500"
        >
          {isSignUp && (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div className="mb-6">
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
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="mb-6">
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
            className="w-full bg-sky-500 text-white p-3 rounded-lg shadow-sm hover:bg-sky-600"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <p className="mt-4 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sky-500 hover:underline"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sky-500 hover:underline">Go to Front Page 
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans p-8">
      <div className="flex items-center mb-6">
        <FaUserCircle className="text-6xl text-sky-700 mr-4" />
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index} className="mb-2 p-4 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold">Order {index + 1}</h3>
            <ul>
              {order.cart.map((item, idx) => (
                <li key={idx}>
                  {item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="text-gray-500">Total Price: ${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
            <p className="text-gray-500">Ordered on: {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-lg shadow-sm hover:bg-red-600">
          Logout
        </button>
        <Link href="/" className="ml-4 text-sky-500 hover:underline">Go to Front Page</Link>
      </div>
    </div>
  );
}