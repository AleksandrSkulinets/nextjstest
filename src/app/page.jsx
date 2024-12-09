// /pages/index.js
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  // Check if running on the server or client
  const isServerSide = typeof window === 'undefined'; 

  // Use full URL during SSR (if server-side), relative URL for CSR (client-side)
  const apiUrl = isServerSide ? `http://localhost:3000/api/categories` : `/api/categories`;

  try {
    const response = await fetch(apiUrl);
    const categories = await response.json();

    if (!response.ok || categories.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-semibold text-center mb-6">Categories</h1>
          <p className="text-center text-xl">No categories available.</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold text-center mb-6">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.catid} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Link href={`/${category.catid}`}>
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={`/images/category/${category.catimage}`} 
                    alt={category.catname}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold text-center">{category.catname}</h2>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-semibold text-center mb-6">Categories</h1>
        <p className="text-center text-xl">An error occurred while fetching categories.</p>
      </div>
    );
  }
}
