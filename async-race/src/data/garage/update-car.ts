import { API_URL } from '../api';

import type { Car } from '../../types/types';

export async function updateCar(id: number, name: string, color: string): Promise<Car | undefined> {
  try {
    const response = await fetch(`${API_URL}/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update the car ${id}: ${errorText || response.statusText}`);
      return undefined;
    }

    const updatedCar: Car = await response.json();
    return updatedCar;
  } catch (error) {
    console.error(`Error while updating the car ${id}:`, error);
    return undefined;
  }
}
