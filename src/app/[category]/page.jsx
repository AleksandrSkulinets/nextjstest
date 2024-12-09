import { notFound } from 'next/navigation'; // Import notFound for 404 handling
import Image from 'next/image'; // Import Image from Next.js for optimized image handling
import Head from 'next/head';

// Fetch and dynamically generate metadata for the page
export async function generateMetadata({ params }) {
  const { category } = params;

  // Check if running on the server
  const isServerSide = typeof window === 'undefined'; 
  const apiUrl = isServerSide ? `http://localhost:3000/api/categories/${category}/products` : `/api/categories/${category}/products`; // Use full URL in SSR

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return { title: 'Category Not Found', description: 'The requested category does not exist.' };
    }

    const products = await response.json();
    const categoryName = products.length > 0 ? products[0].catname : 'Unknown Category';

    return {
      title: `Shopname - ${categoryName}`,
      description: `Browse products in the ${categoryName} category.`,
    };
  } catch (error) {
    return {
      title: 'Error',
      description: 'An error occurred while fetching the category data.',
    };
  }
}

export default async function CategoryPage({ params }) {
  const { category } = params; // Access category parameter

  // Check if running on the server
  const isServerSide = typeof window === 'undefined'; 
  const apiUrl = isServerSide ? `http://localhost:3000/api/categories/${category}/products` : `/api/categories/${category}/products`; // Use full URL in SSR

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      notFound(); // Redirect to 404 page if category not found
      return; // Prevent further code execution
    }

    const products = await response.json();

    const categoryName = products.length > 0 ? products[0].catname : 'Unknown Category';

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Products in Category: {categoryName}</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product.prodid} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src={`/images/products/${product.prodimage}`} // Path to image
                  alt={product.prodname}
                  width={300} // Set width and height
                  height={300}
                  className="w-full h-48 object-cover" // Tailwind styles for image
                />
                <div className="p-4">
                  <h2 className="text-xl font-medium text-gray-800">{product.prodname}</h2>
                  <p className="text-sm text-gray-600 mt-2">{product.proddescr}</p>
                </div>
                <div className="p-4">
                  <a
                    href={`/${category}/${product.prodid}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Product
                  </a>
                </div>
              </li>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </ul>
      </div>
    );
  } catch (error) {
    notFound(); // Trigger 404 if there's an error
    return; // Return early to avoid further rendering
  }
}
