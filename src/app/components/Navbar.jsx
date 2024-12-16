"use client"; // Ensure the component is client-side

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Ensure this is set in .env
        const response = await fetch(`${apiUrl}/api/categories`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Only run once when component mounts

  return (
    <div className="flex mx-auto w-full max-w-[1400px] justify-between items-center p-1">
      <h1 className="animate-gradient text-2xl font-extrabold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text">
       <Link href={"/"}>ShopLogo</Link> 
      </h1>

      <div>
        <ul className="flex space-x-4">
          {/* Show loading state */}
          {loading && <li>Loading categories...</li>}

          {/* Show error message if there is an error */}
          {error && <li className="text-red-500">Error: {error}</li>}

          {/* Show message if no categories are available */}
          {categories?.length === 0 ? (
            <li>No categories available</li>
          ) : (
            categories?.map((category) => (
              <li key={category.catid}>
                <Link href={`/${category.catid}`} className="text-gray-300 hover:underline">
                  {category.catname}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
