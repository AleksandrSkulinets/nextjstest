import supabase from "../../../db"; // Import the Supabase client

export async function GET(req, { params }) {
  const { category } = params; // Extract 'category' (catid) from the URL params

  try {
    // Query to fetch products and category name for the given catid using Supabase
    const { data: products, error } = await supabase
      .from('products') // Specify the 'products' table
      .select('*, category(catname)') // Join the 'category' table to get the 'catname'
      .eq('catid', category); // Filter by category (catid)

    if (error) {
      // Handle errors returned by Supabase
      console.error('Error fetching products:', error.message);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch products' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (products.length === 0) {
      // Return 404 if no products are found
      return new Response(
        JSON.stringify({ error: 'No products found for this category' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the products and category name as JSON
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);

    // Return a 500 response in case of errors
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
