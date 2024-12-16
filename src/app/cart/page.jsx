"use client"; // Ensure this is a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

const CartPage = () => {
  // Load cart from localStorage
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  
  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const router = useRouter();

  // Handle checkout (for now, just log and redirect)
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    console.log("Proceeding to checkout with items:", cart);
    router.push("/checkout"); // Redirect to checkout page (or success page)
  };

  // Handle item removal from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.prodname !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
  };

  return (
    <>
      <Head>
        <title>Your Cart - Shopname</title>
        <meta name="description" content="Your shopping cart" />
      </Head>

      <div className="mt-6 px-4">
        <h1 className="font-bold text-2xl my-4">Shopping Cart</h1>

        {/* Display cart items */}
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
