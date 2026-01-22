import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

export async function deleteWinner(id: number): Promise<boolean> {
  const result = await fetchData(`${API_URL}/winners/${id}`, { method: 'DELETE' });

  return !!result;
}
