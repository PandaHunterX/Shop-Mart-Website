import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import products from '../data/products.json';

export default function ProductList({ addToCart }) {
  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
          >
            {/* Product Image */}
            <div className="relative w-full h-56">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform hover:scale-105"
              />
            </div>

            {/* Product Details */}
            <div className="p-4">
              <Link
                href={`/products/${product.id}`}
                className="block text-lg font-semibold text-indigo-700 hover:text-sky-500 transition"
              >
                {product.name}
              </Link>
              <p className="text-gray-500 text-sm mt-1">${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-sky-400 transition"
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
