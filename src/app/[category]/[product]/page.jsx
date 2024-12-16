"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation after checkout
import Head from "next/head";
import { notFound } from 'next/navigation';

const ProductPage = ({ params }) => {
  const { category, product } = params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [productData, setProductData] = useState(null);
  const [cart, setCart] = useState([]); // State to hold cart items
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  useEffect(() => {
    // Set client-side flag to true when the component mounts
    setIsClient(true);

    // Fetch product data
    const fetchProduct = async () => {
      const response = await fetch(`${apiUrl}/api/categories/${category}/products/${product}`);
      if (!response.ok) {
        if (response.status === 404) {
          notFound();
          return;
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProductData(data);
    };

    fetchProduct();
  }, [category, product]);

  useEffect(() => {
    // Only access localStorage on the client side
    if (isClient) {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    }
  }, [isClient]);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
    alert(`Added ${product.prodname} to the cart`);
  };

  if (!productData) return null;

  return (
    <>
      <Head>
        <title>Shopname - {productData.prodname}</title>
        <meta name="description" content={productData.proddescr} />
      </Head>
      <div className="mt-6">
        <h1 className="font-bold text-2xl my-2">{productData.prodname}</h1>
        <img
          src={`/images/products/${productData.prodimage}`}
          alt={productData.prodname}
          width={500}
          height={500}
        />
        <p>{productData.proddescr}</p>
        <p>Manufacturer: {productData.manufacturer}</p>
        <p>Price: ${productData.price}</p>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(productData)} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Add to Cart
        </button>

        {/* Optional: Display items in the cart */}
        <div className="mt-6">
          <h2 className="font-bold text-xl">Cart ({cart.length} items)</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="my-2">
                {item.prodname} - ${item.price}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
