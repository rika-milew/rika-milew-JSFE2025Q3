import { API_URL, ERROR_RESPONSE } from '@api/api';

export async function deleteCar(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/garage/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`Failed to delete the car ${id}. Status: ${response.status}`);
    }

    try {
      const winnersResponse = await fetch(`${API_URL}/winners/${id}`, { method: 'DELETE' });
      if (!winnersResponse.ok && winnersResponse.status !== ERROR_RESPONSE) {
        throw new Error(
          `Failed to delete the car ${id} from winners. Status: ${winnersResponse.status}`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error while deleting the car from the winners');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error while deleting the car');
  }
}
