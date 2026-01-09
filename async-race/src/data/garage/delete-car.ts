import { API_URL } from '../api';

export async function deleteCar(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/garage/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      console.error(`Failed to delete the car ${id}: ${response.status} ${response.statusText}`);
      return false;
    }

    try {
      await fetch(`${API_URL}/winners/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Failed to delete the car ${id} from winners:`, error);
    }

    return true;
  } catch (error) {
    console.error(`Error while deleting the car ${id}:`, error);
    return false;
  }
}
