const { VITE_SUPABASE_URL, VITE_SUPABASE_TOKEN } = import.meta.env;

const get = async <T>(table: string) => {
  try {
    const url = new URL(`${VITE_SUPABASE_URL}/rest/v1/${table}`);
    url.searchParams.append('apikey', VITE_SUPABASE_TOKEN);
    const response = await fetch(url);
    return response.json() as T;
  } catch {
    throw new Error('ERROR_SUPABASE_LOAD');
  }
};

export default { get };
