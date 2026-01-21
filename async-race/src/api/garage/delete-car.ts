import { API_URL, ERROR_RESPONSE } from '@/data/constants';

export async function deleteCar(id: number): Promise<void> {
  const garageResponse = await fetch(`${API_URL}/garage/${id}`, { method: 'DELETE' });
  if (!garageResponse.ok) {
    throw new Error(`Failed to delete the car ${id} from garage. Status: ${garageResponse.status}`);
  }

  const winnersResponse = await fetch(`${API_URL}/winners/${id}`, { method: 'DELETE' });
  if (!winnersResponse.ok && winnersResponse.status !== ERROR_RESPONSE) {
    throw new Error(
      `Failed to delete the car ${id} from winners. Status: ${winnersResponse.status}`,
    );
  }
}
