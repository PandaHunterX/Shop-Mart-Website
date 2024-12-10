import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import products from '../../data/products.json';
import "../../app/globals.css";

export default function ProductDetail({ cart = [], buyNow }) {
  const router = useRouter();
  const { id } = router.query;

  // Find the product based on the id from the query
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  // Filter related products based on category and exclude the current product
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .sort(() => 0.5 - Math.random()) // Randomize the selection
    .slice(0, 3); // Select only 3 products

  return (
    <div>
      {/* Product Details */}
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

      {/* Related Products */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <li
              key={relatedProduct.id}
              className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="relative w-full h-56">
                <Image
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4">
                <Link
                  href={`/products/${relatedProduct.id}`}
                  className="block text-lg font-semibold text-indigo-700 hover:text-sky-500 transition"
                >
                  {relatedProduct.name}
                </Link>
                <p className="text-gray-500 text-sm mt-1">${relatedProduct.price}</p>
                <button
                  onClick={() => buyNow(relatedProduct)}
                  className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-sky-400 transition"
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}