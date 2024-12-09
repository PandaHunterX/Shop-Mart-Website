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
    <div className="min-h-screen bg-sky-50 text-indigo-900 font-sans">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-800">{product.name}</h1>
        <div className="relative w-full mb-8" style={{ paddingBottom: '56.25%' }}>
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-md"
          />
        </div>
        <p className="mb-6 text-gray-700 leading-relaxed">{product.description}</p>
        <p className="mb-6 text-2xl font-semibold text-indigo-900">${product.price}</p>
        
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
          <button
            onClick={() => buyNow(product)}
            className="bg-indigo-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-indigo-400 transition-transform transform hover:scale-105 duration-200"
          >
            Buy Now
          </button>
          
          <Link href="/cart" className="relative bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-full shadow-md transition-transform transform hover:scale-105 duration-200">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
        
        <Link href="/" className="mt-8 inline-block bg-indigo-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-indigo-400 transition-transform transform hover:scale-105 duration-200">
          Back to Home
        </Link>
      </div>
    </div>
  );
  
}