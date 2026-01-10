import { API_URL } from '../api';

import type { Car } from '../../types/types';

export async function createCar(name: string, color: string): Promise<Car | undefined> {
  try {
    const response = await fetch(`${API_URL}/garage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to create a new car: ${error || response.statusText}`);
      return undefined;
    }

    const car: Car = await response.json();
    return car;
  } catch (error) {
    console.error('Error while creating a car:', error);
    return undefined;
  }
}
