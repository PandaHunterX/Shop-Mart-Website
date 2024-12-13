// components/ShoppingCart.js
import React from 'react';
import Image from 'next/image';

export default function ShoppingCart({ cart, removeFromCart, clearCart, updateQuantity, handleCheckout }) {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
<<<<<<< Updated upstream
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                <Image src={item.image} alt={item.name} width={50} height={50} className="rounded" />
                <span>{item.name} (x{item.quantity})</span>
                <span className="font-semibold">${item.price * item.quantity}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-300 text-black p-1 rounded"
=======
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 sm:text-xl">Your Items</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 md:p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow p-1"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded object-cover w-12 h-12 md:w-20 md:h-20"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium md:text-xl text-sm">{item.name}</p>
                  <p className="text-gray-500 md:text-base text-xs">
                    Quantity: <strong>{item.quantity}</strong>
                  </p>
                </div>
                <p className="md:text-lg font-semibold text-gray-700 text-sm">
                  ₱ {item.price * item.quantity}
                </p>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm md:text-lg"
>>>>>>> Stashed changes
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
<<<<<<< Updated upstream
                    className="bg-gray-300 text-black p-1 rounded"
=======
                    className="w-6 h-6 md:w-8 md:h-8  flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm md:text-lg"
>>>>>>> Stashed changes
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
<<<<<<< Updated upstream
                    className="bg-red-500 text-white p-1 rounded"
=======
                    className="w-6 h-6 md:w-8 md:h-8  flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white text-sm md:text-lg"
>>>>>>> Stashed changes
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
<<<<<<< Updated upstream
          <div className="mt-4 text-right">
            <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
=======
          <div className="mt-4 flex items-center justify-between">
            <span className="md:text-xl font-bold text-gray-800 text-lg">
              Total: ₱ {totalPrice.toFixed(2)}
            </span>
            <button
              onClick={clearCart}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg shadow hover:bg-red-600 transition-all"
            >
              Clear Cart
            </button>
>>>>>>> Stashed changes
          </div>
          <button
            onClick={clearCart}
            className="mt-4 bg-red-500 text-white p-2 rounded"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}