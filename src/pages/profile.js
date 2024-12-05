// pages/profile.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import "../app/globals.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      alert('User already exists');
    } else {
      const newUser = { name: email.split('@')[0], email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
          className="w-full bg-sky-500 hover:bg-sky-400 text-white py-3 rounded-lg shadow-md transition duration-200 font-semibold"
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-6 text-sky-600 hover:text-sky-500 font-medium transition duration-200"
      >
        {isSignUp
          ? 'Already have an account? Login'
          : "Don't have an account? Sign Up"}
      </button>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-gray-500 hover:bg-gray-400 text-white py-2 px-6 rounded-lg shadow transition duration-200"
      >
        Back
      </button>
    </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-center bg-sky-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-sky-700 mb-6">Profile</h1>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto border-t-4 border-sky-500">
        <div className="flex items-center justify-center mb-4">
          <FaUserCircle className="text-8xl text-sky-300" />
        </div>
        <div className="text-sky-800">
          <p className="text-3xl font-semibold mb-2">{user.name}</p>
          <p className="text-xl text-sky-600">{user.email}</p>
        </div>
        <div className="flex flex-col space-y-3 mt-6">
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded shadow transition duration-200"
          >
            Logout
          </button>
          <button 
            onClick={() => router.back()} 
            className="bg-sky-500 hover:bg-sky-400 text-white py-2 px-4 rounded shadow transition duration-200"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold text-sky-700 mb-4">Purchase History</h2>
        {user.purchaseHistory && user.purchaseHistory.length > 0 ? (
          <ul className="space-y-4">
            {user.purchaseHistory.map((item, index) => (
              <li 
                key={index} 
                className="flex justify-between items-center p-4 bg-white shadow rounded-lg hover:shadow-md transition duration-200 border-l-4 border-sky-500"
              >
                <div className="flex items-center space-x-4">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={50} 
                    height={50} 
                    className="rounded-md"
                  />
                  <div>
                    <span className="block text-sky-700 font-semibold">{item.name} (x{item.quantity})</span>
                    <p className="text-sm text-sky-500">{item.timestamp}</p>
                    <p className="text-sm text-sky-500">Status: {item.status || 'Pending'}</p>
                    {item.status === 'Accepted' && (
                      <p className="text-sm text-green-600 font-medium">Arrival in: {item.arrivalTime} minutes</p>
                    )}
                  </div>
                </div>
                <span className="text-sky-700 font-semibold">${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sky-600">No purchase history available.</p>
        )}
      </div>
    </div>
  );
}