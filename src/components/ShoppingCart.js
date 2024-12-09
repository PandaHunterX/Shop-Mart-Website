import React from 'react';
import Image from 'next/image';

export default function ShoppingCart({ cart, removeFromCart, clearCart, updateQuantity }) {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingThreshold = 50; // Free shipping threshold
  const remainingForFreeShipping = Math.max(0, shippingThreshold - totalPrice);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">
              Your cart is empty. <a href="/" className="text-blue-500 underline">Start shopping now</a>.
            </p>
          ) : (
            <>
              {/* Free Shipping Progress */}
              <div className="mb-4">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-sm text-gray-600 mb-2">
                    You're <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> away from free shipping!
                  </p>
                ) : (
                  <p className="text-sm text-green-600 mb-2 font-semibold">You qualify for free shipping!</p>
                )}
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-red-500 rounded-full"
                    style={{
                      width: `${Math.min((totalPrice / shippingThreshold) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Item List */}
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded-lg"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded-lg"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Summary Section */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span>Shipping Discount</span>
              <span className="text-green-500">- ${(remainingForFreeShipping === 0 ? 5 : 0).toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span>Shipping & Handling</span>
              <span>${(remainingForFreeShipping === 0 ? 0 : 5).toFixed(2)}</span>
            </li>
            <li className="flex justify-between border-t pt-2 font-bold">
              <span>Balance</span>
              <span>${(totalPrice + (remainingForFreeShipping === 0 ? 0 : 5)).toFixed(2)}</span>
            </li>
          </ul>
          <button
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600"
            onClick={() => alert('Proceed to checkout')}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
