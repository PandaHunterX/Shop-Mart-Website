import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import products from '../data/products.json';

export default function ProductList({ addToCart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const productsPerPage = 6;

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  );

  // Calculate the products to display based on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // Reset to page 1 when category changes
          }}
          className="w-full p-2 border rounded-lg"
        >
          <option value="All">All</option>
          <option value="Men Clothes">Men Clothes</option>
          <option value="Women Clothes">Women Clothes</option>
          <option value="Kids Clothes">Kids Clothes</option>
          <option value="Unisex Clothes">Unisex Clothes</option>
          <option value="Toys">Toys</option>
          <option value="Foods">Foods</option>
          <option value="Appliances">Appliances</option>
        </select>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 rounded-lg transition ${currentPage === number ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}