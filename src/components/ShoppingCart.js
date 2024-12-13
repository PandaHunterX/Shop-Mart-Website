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
      <h2 className="text-3xl font-semibold mb-6 text-blue-950 md:text-2xl sm:text-xl">Your Items</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center text-base sm:text-sm">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 sm:space-y-3">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow sm:gap-2 sm:p-2"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded object-cover md:w-20 md:h-20 w-12 h-12"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium md:text-lg text-xs">
                    {item.name}
                  </p>
                  <p className="text-gray-500 md:text-sm text-xs">
                    Quantity: <strong>{item.quantity}</strong>
                  </p>
                </div>
                <p className="font-semibold text-gray-700 md:text-lg text-xs">
                  ₱ {item.price * item.quantity}
                </p>
                <div className="flex items-center space-x-2 sm:space-x-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 md:w-8 md:h-8 md:text-base w-4 h-4 text-xs"
                  >
                    &minus;
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 md:w-8 md:h-8 md:text-base w-4 h-4 text-xs"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white md:w-8 md:h-8 md:text-base w-4 h-4 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <span className="md:text-2xl font-bold text-gray-800 text-lg">
              Total: ₱ {totalPrice.toFixed(2)}
            </span>
            <button
              onClick={clearCart}
              className="md:px-4 md:py-2 text-white bg-red-500 rounded-lg shadow hover:bg-red-600 transition-all md:text-base px-3 py-1 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}