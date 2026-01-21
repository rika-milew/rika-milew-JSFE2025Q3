import { API_URL } from '@/data/constants';

import type { Car } from '@/types/types';

export async function createCar(name: string, color: string): Promise<Car> {
  const response = await fetch(`${API_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Failed to create a new car. Status: ${response.status}`);
  }

  const car: Car = await response.json();
  return car;
}
