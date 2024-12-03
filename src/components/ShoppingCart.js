// components/ShoppingCart.js
import React from 'react';
import Image from 'next/image';

export default function ShoppingCart({ cart, removeFromCart, clearCart, updateQuantity }) {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
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
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-300 text-black p-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right">
            <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
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