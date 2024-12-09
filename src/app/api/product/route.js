import supabase from "../db"; // Import Supabase client

export async function GET(req) {
  try {
    console.log('Attempting to fetch products from Supabase...');

    // Fetch products from Supabase
    const { data, error } = await supabase
      .from('products') // Your table name in Supabase
      .select('*'); // Select all columns

    if (error) {
      throw new Error(error.message); // Handle error
    }

    console.log('Fetched products:', data); // Log the fetched products

    // Return response with the products data
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Error fetching products:', err.message);

    // Return error response if something goes wrong
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products', details: err.message }),
      { status: 500 }
    );
  }
}
