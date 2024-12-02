"use client";

import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import Link from 'next/link';


export default function Home() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans">
    {/* Header Section */}
    <header className="bg-indigo-600 text-white py-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-5xl font-extrabold tracking-wide">
          Shop Mart
        </h1>
        <nav className="space-x-6">
          <Link
            href="cart"
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-full shadow-md transition-all duration-200 text-lg"
          >
            🛒 Cart
          </Link>
          <Link
            href="profile"
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-full shadow-md transition-all duration-200 text-lg"
          >
            👤 Profile
          </Link>
        </nav>
      </div>
    </header>

    {/* Main Content */}
    <main className="flex items-center justify-center min-h-screen py-8 px-6">
      <div className="w-full max-w-6xl">
        <h2 className="text-4xl font-semibold mb-8 text-center tracking-wide">
          Discover Our Exclusive Products
        </h2>

        {/* Product List Section */}
        <ProductList addToCart={addToCart} />
      </div>
    </main>

    {/* Footer Section */}
    <footer className="bg-indigo-600 text-white py-4 text-center">
      <p className="text-base">
        © {new Date().getFullYear()} Shop Mart. All rights reserved.
      </p>
    </footer>
  </div>
);
}