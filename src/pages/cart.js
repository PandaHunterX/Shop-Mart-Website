// pages/cart.js
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      <div className="flex justify-between mb-4">
        <Link href="/" className="bg-blue-500 text-white p-2 rounded-full shadow-md">
          🏠
        </Link>
        <Link href="/profile" className="bg-green-500 text-white p-2 rounded-full shadow-md">
          👤
        </Link>
      </div>
      <ShoppingCart
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        updateQuantity={updateQuantity}
        handleCheckout={handleCheckout}
      />
    </div>
  );
}