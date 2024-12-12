import React from "react";
import Image from "next/image";

export default function ShoppingCart({
  cart,
  removeFromCart,
  clearCart,
  updateQuantity,
}) {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium text-lg">{item.name}</p>
                  <p className="text-gray-500 text-sm">
                    Quantity: <strong>{item.quantity}</strong>
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  ${item.price * item.quantity}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    &minus;
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </span>
            <button
              onClick={clearCart}
              className="px-4 py-2 text-white bg-red-500 rounded-lg shadow hover:bg-red-600 transition-all"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
