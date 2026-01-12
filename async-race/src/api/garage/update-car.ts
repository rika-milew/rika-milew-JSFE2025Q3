import { API_URL } from '../api';

import type { Car } from '../../types/types';

export async function updateCar(id: number, name: string, color: string): Promise<Car> {
  const ERROR_RESPONSE = 404;

  try {
    const response = await fetch(`${API_URL}/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      if (response.status === ERROR_RESPONSE) {
        throw new Error(`The car with id ${id} not found`);
      }
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to update the car ${id}. Status: ${response.status}`);
    }

    const updatedCar: Car = await response.json();
    return updatedCar;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error while updating the car');
  }
}
