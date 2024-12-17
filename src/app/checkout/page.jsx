// pages/checkout.jsx

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cart: JSON.parse(localStorage.getItem("cart")), // Sending cart data
        }),
      });
  
      if (response.ok) {
        alert("Order placed successfully!");
  
        // Clear cart from localStorage and redirect
        localStorage.removeItem("cart");
        setIsSubmitting(false); // Reset submit state if needed
        router.push("/thank-you"); // Redirect to a thank-you page
      } else {
        alert("There was an error placing your order.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your Name"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Your Email"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Your Phone"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
