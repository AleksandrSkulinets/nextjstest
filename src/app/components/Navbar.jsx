"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import IconCart from "./icons/CartIcon";
import IconMenu from "./icons/MenuIcon";
import IconClose from "./icons/IconClose";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility

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

      {/* Desktop Menu */}
      <div className="hidden md:flex">
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
          <li>
            <Link href={"/cart"}>
              <IconCart />
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-30">
        <button  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-gray-800 bg-opacity-90 p-4 md:hidden z-20">
            <div className="flex flex-col items-center justify-center z-20">
          <ul className="space-y-6 mt-36">
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
                  <Link href={`/${category.catid}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:underline text-xl">
                    {category.catname}
                  </Link>
                </li>
              ))
            )}

            <li>
              <Link href={"/cart"} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                <IconCart />
              </Link>
            </li>
          </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
