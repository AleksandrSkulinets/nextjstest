import supabase from "../../../../db"; // Import the Supabase client

export async function GET(req, { params }) {
  const { category, product } = params; // Extract 'category' (catid) and 'product' (prodid) from the URL params

  try {
    // Query to fetch the specific product in the given category using Supabase
    const { data: productData, error } = await supabase
      .from('products') // Specify the 'products' table
      .select('*, category(catname)') // Join 'category' table to get 'catname'
      .eq('prodid', product) // Filter by the specific 'prodid'
      .eq('catid', category); // Filter by the specific 'catid'

    if (error) {
      // Handle errors returned by Supabase
      console.error('Error fetching product:', error.message);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch product' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (productData.length === 0) {
      // Return 404 if no product is found for the given category and prodid
      return new Response(
        JSON.stringify({ error: 'Product not found in this category' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the specific product data as JSON
    return new Response(JSON.stringify(productData[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching product:', error.message);

    // Return a 500 response in case of errors
    return new Response(
      JSON.stringify({ error: 'Failed to fetch product' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
