"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation after checkout
import Head from "next/head";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false); // State to track if we are on the client-side
  const router = useRouter();

  useEffect(() => {
    // Check if window is available (this ensures client-side execution)
    setIsClient(true);

    // Fetch the cart from localStorage only on the client side
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []); // Empty dependency array means this runs only once after the first render

  // Calculate the total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // Handle checkout (for now, just log and redirect to a success page)
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    console.log("Proceeding to checkout with items:", cart);
    router.push("/checkout"); // Redirect to a checkout page (or a success page)
  };

  // Handle remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.prodname !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  if (!isClient) {
    return null; // Ensure the page does not render until it's safe to use localStorage
  }

  return (
    <>
      <Head>
        <title>Your Cart - Shopname</title>
        <meta name="description" content="Your shopping cart" />
      </Head>

      <div className="mt-6 px-4">
        <h1 className="font-bold text-2xl my-4">Shopping Cart</h1>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.prodname} className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <img
                    src={`/images/products/${item.prodimage}`}
                    alt={item.prodname}
                    width={80}
                    height={80}
                    className="mr-4"
                  />
                  <div>
                    <h2 className="font-semibold">{item.prodname}</h2>
                    <p>{item.proddescr}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.prodname)}
                    className="mt-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Total */}
        <div className="mt-6 flex justify-between items-center font-semibold">
          <p>Total Price:</p>
          <p>${totalPrice}</p>
        </div>

        {/* Checkout Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
