import supabase from '../db'; // Import the Supabase client

export async function GET(req) {
  try {
    // Fetch data from the 'category' table using Supabase
    const { data: rows, error } = await supabase
      .from('category') // Specify the table name
      .select('*'); // Fetch all columns from the 'category' table

    if (error) {
      // Handle Supabase query errors
      console.error('Error fetching categories:', error.message);
      return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (rows.length === 0) {
      // Return 404 response if no categories are found
      return new Response(JSON.stringify({ error: 'No categories found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the fetched categories as JSON
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);

    // Return 500 response in case of errors
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
