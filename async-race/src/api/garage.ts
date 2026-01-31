import { API_URL } from '@/constants/constants';

import type { Car, Cars } from '@/types/types';

export async function createCar(name: string, color: string): Promise<Car | undefined> {
  const url = `${API_URL}/garage`;

  try {
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      console.error(`Failed to create car: ${response.status}`);
      return undefined;
    }

    const car: Car = await response.json();
    return car;
  } catch (error) {
    console.error('Failed to create car', error);
    return undefined;
  }
}

export async function deleteCar(id: number): Promise<boolean> {
  try {
    const response: Response = await fetch(`${API_URL}/garage/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error(`Failed to delete the car: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete the car', error);
    return false;
  }
}

export async function getCars(): Promise<Cars | undefined> {
  const url = `${API_URL}/garage`;

  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to get cars: ${response.status}`);
      return undefined;
    }

    const cars: Car[] = await response.json();

    const headResponse = await fetch(url, { method: 'HEAD' });
    const totalCountHeader = headResponse.ok
      ? Number(headResponse.headers.get('X-Total-Count'))
      : 0;
    const totalCount = totalCountHeader > 0 ? totalCountHeader : cars.length;

    return { cars, totalCount };
  } catch (error) {
    console.error('Failed to get cars', error);
    return undefined;
  }
}

export async function updateCar(id: number, name: string, color: string): Promise<Car | undefined> {
  const url = `${API_URL}/garage/${id}`;

  try {
    const response: Response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      console.error(`Failed to update the car: ${response.status}`);
      return undefined;
    }

    const car: Car = await response.json();
    return car;
  } catch (error) {
    console.error('Failed to update the car', error);
    return undefined;
  }
}
