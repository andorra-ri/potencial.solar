import { describe, it, expect, vi } from 'vitest';
import api from '/@/services/supabase';

// TODO: Test properly the service, including rejection
describe('Supabase API service', () => {
  it('should make a query to table', async () => {
    const fetch = vi.spyOn(global, 'fetch');
    await api.get('TABLE');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
