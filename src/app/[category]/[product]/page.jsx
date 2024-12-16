"use client"; // Ensure this is a client-side component

import { useState, useEffect } from "react";
import { use } from "react"; // For the use() hook to unwrap params
import { notFound } from 'next/navigation';
import Head from "next/head";
import { useRouter } from 'next/navigation'; // For navigation

const ProductPage = ({ params }) => {
  const { category, product } = use(params); // Unwrap params
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const [productData, setProductData] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []); // Load cart from localStorage

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${apiUrl}/api/categories/${category}/products/${product}`);
      if (!response.ok) {
        if (response.status === 404) {
          notFound(); // Redirect to 404 page if the product is not found
          return;
        }
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      setProductData(data); // Set product data when fetched successfully
    };

    fetchProduct();
  }, [category, product]);

  // Add to cart handler
  const addToCart = (product) => {
    const updatedCart = [...cart, product]; // Add new product to cart
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
    alert(`${product.prodname} has been added to your cart!`);
  };

  if (!productData) return null; // Return null if no product data yet

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
      </div>
    </>
  );
};

export default ProductPage;
