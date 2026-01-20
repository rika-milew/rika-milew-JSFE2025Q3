import { API_URL } from '@data/constants';

export async function deleteWinner(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/winners/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      errorMessage || `Failed to delete the winner ${id}. Status: ${response.status}`,
    );
  }
}
