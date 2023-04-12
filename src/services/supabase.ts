import { camelizeKeys } from 'humps';

const { VITE_SUPABASE_URL, VITE_SUPABASE_TOKEN } = import.meta.env;

const get = async <T>(table: string) => {
  try {
    const url = new URL(`${VITE_SUPABASE_URL}/rest/v1/${table}`);
    url.searchParams.append('apikey', VITE_SUPABASE_TOKEN);
    const response = await fetch(url);
    const data = await response.json();
    return camelizeKeys(data) as T;
  } catch {
    throw new Error('ERROR_SUPABASE_LOAD');
  }
};

export type * from './types';

export default { get };
