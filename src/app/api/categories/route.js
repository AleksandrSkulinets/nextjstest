// /pages/api/categories.js
import supabase from '../db'; // Ensure supabase client is correctly set up

export async function GET(req) {
  try {
    console.log('Attempting to fetch categories from Supabase...');

    // Fetch categories from Supabase
    const { data, error } = await supabase
      .from('categories') // Assuming 'categories' is your table name
      .select('*'); // Adjust according to your table's structure

    if (error) {
      throw new Error(error.message);
    }

    console.log('Fetched categories:', data);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch categories', details: err.message }),
      { status: 500 }
    );
  }
}
