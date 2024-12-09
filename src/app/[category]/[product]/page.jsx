import { notFound } from 'next/navigation'; // Import notFound for 404 handling

// Export metadata for this page
export async function generateMetadata({ params }) {
  const { category, product } = params;

  // Check if running on the server
  const isServerSide = typeof window === 'undefined';
  const apiUrl = isServerSide 
    ? `http://localhost:3000/api/categories/${category}/products/${product}` // Full URL for SSR
    : `/api/categories/${category}/products/${product}`; // Relative URL for client-side

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return { 
        title: 'Product Not Found', 
        description: 'This product does not exist.' 
      };
    }

    const productData = await response.json();

    if (!productData) {
      return { 
        title: 'Product Not Found', 
        description: 'This product does not exist.' 
      };
    }

    const productTitle = productData.prodname; // Extract product name for title

    // Return dynamic metadata based on fetched data
    return {
      title: `Shopname - ${productTitle}`,  // Use a string, not an object
      description: productData.proddescr,  // Set dynamic description
    };
  } catch (error) {
    // Handle fetch or parsing errors
    return {
      title: 'Error',
      description: 'An error occurred while fetching the product data.',
    };
  }
}

export default async function ProductPage({ params }) {
  const { category, product } = params;

  // Check if running on the server
  const isServerSide = typeof window === 'undefined';
  const apiUrl = isServerSide 
    ? `http://localhost:3000/api/categories/${category}/products/${product}` // Full URL for SSR
    : `/api/categories/${category}/products/${product}`; // Relative URL for client-side

  // Fetch product details
  const fetchProduct = async () => {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        notFound(); // Trigger the 404 redirect for not found product
        return;
      }
      throw new Error('Failed to fetch product');
    }
    
    return response.json(); // Return product data
  };

  try {
    const productData = await fetchProduct();

    if (!productData) {
      notFound(); // Trigger 404 if no product data
      return;
    }

    return (
      <div>
        <h1>{productData.prodname}</h1>
        <img 
          src={`/images/products/${productData.prodimage}`} 
          alt={productData.prodname} 
          width={500} 
          height={500} 
        />
        <p>{productData.proddescr}</p>
        <p>Price: ${productData.price}</p>
      </div>
    );
  } catch (error) {
    notFound(); // Trigger 404 if there's an error
    return;
  }
}
