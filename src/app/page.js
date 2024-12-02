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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Simple Shopping Site</h1>
      <div className="flex justify-between mb-4">
        <Link href="cart" className="bg-blue-500 text-white p-2 rounded-full shadow-md">
          🛒
        </Link>
        <Link href="profile" className="bg-green-500 text-white p-2 rounded-full shadow-md">
          👤
        </Link>
      </div>
      <ProductList addToCart={addToCart} />
    </div>
  );
}