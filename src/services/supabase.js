const { VITE_SUPABASE_URL, VITE_SUPABASE_TOKEN } = import.meta.env;

const get = async table => {
  try {
    const url = new URL(`${VITE_SUPABASE_URL}/rest/v1/${table}`);
    url.searchParams.append('apikey', VITE_SUPABASE_TOKEN);
    const response = await fetch(url);
    return response.json();
  } catch {
    throw new Error('ERROR_SUPABASE_LOAD');
  }
};

export default { get };
