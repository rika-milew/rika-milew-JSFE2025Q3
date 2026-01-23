import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

export async function deleteCar(id: number): Promise<boolean> {
  const garageResponse = await fetchData(`${API_URL}/garage/${id}`, { method: 'DELETE' });

  if (!garageResponse) {
    return false;
  }

  await fetchData(`${API_URL}/winners/${id}`, { method: 'DELETE' });

  return true;
}
