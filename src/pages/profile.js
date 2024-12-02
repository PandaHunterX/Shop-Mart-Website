// pages/profile.js
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    // Simulate fetching user data from an API or localStorage
    const storedUser = JSON.parse(localStorage.getItem('user')) || { name: 'Johnny Sins', email: 'johnnySins.doe@example.com' };
    setUser(storedUser);
  }, []);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-5xl font-bold mb-6">Profile</h1>
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          <FaUserCircle className="text-7xl text-gray-400" />
        </div>
        <div>
          <p className="text-2xl font-semibold mb-2">{user.name}</p>
          <p className="text-xl text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
}