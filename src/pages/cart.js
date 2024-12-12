import { useState, useEffect } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import Link from 'next/link';
import "../app/globals.css";
import { auth, db } from '../app/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const districts = { /* district data here */ };

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [district, setDistrict] = useState("");
  const [barangay, setBarangay] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!district || !barangay) {
      alert("Please select a district and barangay.");
      return;
    }

    if (user) {
      try {
        const totalPrice = calculateTotalPrice();
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          cart: cart,
          address: {
            district: district,
            barangay: barangay,
          },
          totalPrice: totalPrice,
          timestamp: new Date(),
        });
        alert("Checkout successful! Order saved.");
        clearCart();
      } catch (error) {
        alert("Error saving order");
      }
    } else {
      alert("Please log in to checkout.");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-light-blue-100">
      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-light-blue-500 text-white p-4 flex justify-between items-center rounded-md">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="text-2xl font-sans bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            href="/profile"
            className="text-2xl font-sans bg-green-600 px-4 py-2 rounded-full hover:bg-green-700"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Shopping Cart Section */}
      <h1 className="text-3xl font-bold mt-4 mb-4"></h1>
      <ShoppingCart
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        updateQuantity={updateQuantity}
      />

      {/* Delivery Address Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 text-white p-3 rounded-full">📍</div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">District</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setBarangay("");
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select District</option>
                {Object.keys(districts).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 text-white p-3 rounded-full">🏠</div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium">Barangay</label>
              <select
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Barangay</option>
                {districts[district]?.map((barangay) => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCheckout}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-400 transform transition-transform hover:scale-105"
          >
            🛒 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
