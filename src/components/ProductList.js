// components/ProductList.js
import React from 'react';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 },
];

export default function ProductList({ addToCart }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul className="space-y-2">
        {products.map(product => (
          <li key={product.id} className="flex justify-between items-center p-2 border-b border-gray-200">
            <Link href={`/products/${product.id}`} className="text-blue-500">
              {product.name}
            </Link>
            <span>${product.price}</span>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-500 text-white p-1 rounded"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}