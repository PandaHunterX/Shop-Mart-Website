// pages/cart.js
import { useState, useEffect } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import Link from 'next/link';

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
      <ShoppingCart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} updateQuantity={updateQuantity} />
    </div>
  );
}