// pages/products/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import products from '../../data/products.json';
import "../../app/globals.css";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
    }
  }, [id]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const buyNow = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
    router.push('/cart');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="relative h-72 w-full mb-4">
        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" className="rounded" />
      </div>
      <p className="mb-4">{product.description}</p>
      <p className="mb-4 font-bold">${product.price}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => buyNow(product)}
          className="bg-blue-500 text-white p-2 rounded-full shadow-md"
        >
          Buy Now
        </button>
        <Link href="/cart" className="relative bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-full shadow-md transition-all duration-200 text-lg">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
        </Link>
      </div>
      <Link href="/" className="mt-4 bg-gray-500 text-white p-2 rounded-full shadow-md">
        Back to Home
      </Link>
    </div>
  );
}