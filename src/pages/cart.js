import { useState, useEffect } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import Link from 'next/link';
import "../app/globals.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const timestamp = new Date().toLocaleString();
      const updatedUsers = users.map(u => {
        if (u.email === user.email) {
          return {
            ...u,
            purchaseHistory: [...(u.purchaseHistory || []), ...cart.map(item => ({ ...item, id: Date.now(), timestamp, status: 'Pending' }))]
          };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('user', JSON.stringify({
        ...user,
        purchaseHistory: [...(user.purchaseHistory || []), ...cart.map(item => ({ ...item, id: Date.now(), timestamp, status: 'Pending' }))]
      }));
      clearCart();
      alert('Checkout successful!');
    } else {
      alert('Please log in to checkout.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-lightBlue-500 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Shopping App
          </Link>
          <div className="space-x-4">
            <Link href="/" className="bg-white text-lightBlue-500 px-4 py-2 rounded-lg shadow-md hover:bg-lightBlue-200">
              🏠 Home
            </Link>
            <Link href="/profile" className="bg-white text-lightBlue-500 px-4 py-2 rounded-lg shadow-md hover:bg-lightBlue-200">
              👤 Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <ShoppingCart
          cart={cart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          updateQuantity={updateQuantity}
          handleCheckout={handleCheckout}
        />
      </main>
    </div>
  );
}
