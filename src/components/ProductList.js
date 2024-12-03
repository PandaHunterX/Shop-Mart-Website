import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import products from '../data/products.json';

export default function ProductList({ addToCart }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul className="space-y-2">
        {products.map(product => (
          <div key={product.id} className="flex justify-between items-center p-2 border-b border-gray-200">
            <Image src={product.image} alt={product.name} width={300} height={300} />
            <li className="flex justify-between items-center w-full">
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
          </div>
        ))}
      </ul>
    </div>
  );
}