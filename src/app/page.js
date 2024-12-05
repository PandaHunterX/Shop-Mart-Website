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
          <h1 className="text-5xl font-extrabold tracking-wide">Shop Mart</h1>
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
      <footer className="bg-indigo-600 text-white py-12">
        {/* Marketing Section */}
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Latest Products and Deals!
          </h2>
          <p className="text-lg mb-6">
            Subscribe to our newsletter for exclusive discounts, new arrivals, and more.
          </p>
          <div className="flex justify-center space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <button className="px-6 py-2 bg-sky-500 hover:bg-sky-400 rounded-lg shadow-md transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-sky-300 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-sky-300 transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-sky-300 transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-sky-300 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-sky-300 transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-sky-300 transition">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-sky-300 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-sky-300 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-sky-300 transition">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://facebook.com" className="hover:text-sky-300 transition">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" className="hover:text-sky-300 transition">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="hover:text-sky-300 transition">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center mt-8 text-sm text-sky-300">
          <p>© {new Date().getFullYear()} Shop Mart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}