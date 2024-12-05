"use client";

import { useState, useEffect, useRef } from "react";
import ProductList from "../components/ProductList";
import Link from "next/link";

export default function Home() {
  const [cart, setCart] = useState([]);
  const productSectionRef = useRef(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-700 to-sky-500 text-white py-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide">
              Shop Mart
            </h1>
            <p className="mt-4 text-lg md:text-xl font-medium text-gray-200">
              "Your one-stop destination for quality, style, and savings!"
            </p>
          </div>
          <nav className="space-x-4">
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

      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-b from-indigo-50 to-sky-100 shadow-inner">
        <h2 className="text-5xl md:text-6xl font-bold text-indigo-800 mb-6 drop-shadow-lg">
          Transform the Way You Shop!
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Experience a seamless shopping journey with our curated selection of top-quality products at unbeatable prices. Your style, your choice!
        </p>
        <button
          onClick={scrollToProducts}
          className="px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-full shadow-lg transition duration-300"
        >
          Start Shopping Now
        </button>
      </section>

      {/* Main Content */}
      <main ref={productSectionRef} className="py-12 px-6">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold mb-8 text-center tracking-wide text-indigo-800">
            Discover Our Exclusive Products
          </h2>

          {/* Product List Section */}
          <ProductList addToCart={addToCart} />
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-indigo-700 to-sky-500 text-white py-12">
        {/* Marketing Section */}
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-md">
            Join Our Community!
          </h2>
          <p className="text-lg mb-6 max-w-xl mx-auto text-white">
            Be the first to know about new arrivals, exclusive deals, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300 w-full sm:w-auto"
            />
            <button className="px-8 py-3 bg-sky-500 hover:bg-sky-400 rounded-lg shadow-md transition duration-300">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
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

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-sky-300 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-sky-300 transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-sky-300 transition">
                  Shipping
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://twitter.com" className="hover:text-sky-300 transition">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://facebook.com" className="hover:text-sky-300 transition">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="hover:text-sky-300 transition">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-sky-300 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sky-300 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sky-300 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-12 text-sm text-sky-300">
          <p>© {new Date().getFullYear()} Shop Mart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
