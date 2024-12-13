import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
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
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
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
                Go to Front Page
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <>
    <header className="bg-gradient-to-r from-indigo-700 to-sky-500 text-white py-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
          <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-8">
            <FaUserCircle className="text-6xl text-white-700 mr-4" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {firstName} {lastName}</h1>
              <p className="text-white-500">{user.email}</p>
            </div>
            </div>
          </div>
          <nav className="space-x-4">
          <Link href="/" className="text-sky-500 hover:underline transition duration-200">
            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-blue-600 transition duration-200">
              Go back to home
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-sm hover:bg-red-600 transition duration-200 text-sm"
          >
            Logout
          </button>
          </nav>
        </div>
      </header>
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 text-indigo-900 font-sans p-8">
      <h2 className="text-2xl font-semibold mt-1 mb-4"> {orders.length === 0 ? 'You have no orders yet' : 'Your Orders'}</h2>
      <ul className="w-full max-w-2xl space-y-4">
        {orders.map((order, index) => (
          <li key={index} className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-2">Order {index + 1}</h3>
            <ul className="space-y-1">
              {order.cart.map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  {item.name} - Quantity: {item.quantity} - Price: ₱ {item.price.toFixed(2)} - Total: ₱ 
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="text-gray-500 mt-2">Total Price: ₱ {order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
            <p className="text-gray-500">Ordered on: {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
            <p className="text-gray-500">Address:  {order.address.barangay}, {order.address.district}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );  
}