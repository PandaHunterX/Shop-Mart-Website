import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import products from '../data/products.json';

export default function ProductList({ addToCart }) {
  return (
    <div className="p-8 bg-gradient-to-b from-indigo-100 to-sky-50 min-h-screen">
      <h2 className="text-5xl font-extrabold mb-12 text-center text-indigo-800 drop-shadow-md">
        Explore Our Products
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:scale-105 ease-in-out"
          >
            {/* Product Image */}
            <div className="relative h-72 w-full group">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-2xl group-hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col space-y-4">
              <Link
                href={`/products/${product.id}`}
                className="text-2xl font-semibold text-indigo-700 hover:text-sky-500 transition-colors"
              >
                {product.name}
              </Link>
              <p className="text-xl font-medium text-gray-700">${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-auto bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-sky-400 hover:to-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                Add to Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
