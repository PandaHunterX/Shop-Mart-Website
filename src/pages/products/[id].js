import React, { useState, useEffect }  from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import products from '../../data/products.json';
import "../../app/globals.css";

export default function ProductDetail({}) {
  const router = useRouter();
  const { id } = router.query;

  // Find the product based on the id from the query
  const product = products.find(p => p.id === parseInt(id));

  const [cart, setCart] = useState([]);

  useEffect(() => {
    document.title = `Shop Mart | ${product?.name || "Product"}`;
  }, [product?.name]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = (product) => {
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

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    router.push('/cart');
  };

  // Filter related products based on category and exclude the current product
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .sort(() => 0.5 - Math.random()) // Randomize the selection
    .slice(0, 4); // Select only 4 products

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 text-indigo-900 font-sans">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Main Content: Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Details */}
          <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-4xl font-extrabold mb-4 text-indigo-800 leading-tight">
              {product.name}
            </h1>
            <div
              className="relative w-full mb-8 rounded-lg shadow-md overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
            >
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
            <p className="mb-6 text-gray-700 leading-relaxed text-lg">
              {product.description}
            </p>
            <p className="mb-6 text-2xl font-semibold text-indigo-900">
              ₱ {product.price}
            </p>
            <div className="flex flex-col items-center space-y-4 md:items-start">
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 w-full md:w-auto">
                <button
                  onClick={() => handleBuyNow(product)}
                  className="bg-indigo-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-indigo-400 hover:shadow-lg transition-transform transform hover:scale-105 duration-200 w-full md:w-auto text-center"
                >
                  Buy Now
                </button>

                <Link
                  href="/cart"
                  className="relative bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-full shadow-md transition-transform transform hover:scale-105 duration-200 w-full md:w-auto text-center"
                >
                  🛒 Cart
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center animate-pulse shadow-lg">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </div>

              <Link
                href="/"
                className="mt-4 bg-indigo-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-indigo-400 hover:shadow-lg transition-transform transform hover:scale-105 duration-200 w-full md:w-auto text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Related Products */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <li
                  key={relatedProduct.id}
                  className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group relative"
                >
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-2">
                    <Link
                      href={`/products/${relatedProduct.id}`}
                      className="block text-sm font-semibold text-indigo-700 hover:text-sky-500 transition"
                    >
                      {relatedProduct.name}
                    </Link>
                    <p className="text-gray-500 text-xs mt-1 font-semibold">
                      ₱ {relatedProduct.price}
                    </p>
                    <button
                      onClick={() => handleAddToCart(relatedProduct)}
                      className="mt-2 w-full bg-indigo-500 text-white py-1 rounded-lg hover:bg-sky-400 transition hover:shadow-lg text-xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}