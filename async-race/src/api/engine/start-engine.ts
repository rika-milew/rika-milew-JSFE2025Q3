import { API_URL, ERROR_RESPONSE, BAD_REQUEST } from '@data/constants';

import type { EngineResponse } from '../../types/types';

export async function startEngine(
  id: number,
  status: 'started' | 'stopped' | 'drive',
): Promise<EngineResponse> {
  try {
    const url = new URL(`${API_URL}/engine`);
    url.searchParams.append('id', id.toString());
    url.searchParams.append('status', status);

    const response = await fetch(url.toString(), { method: 'PATCH' });

    if (!response.ok) {
      const errorMessage = await response.text();

      if (response.status === BAD_REQUEST) {
        throw new Error(errorMessage || 'Wrong parameters');
      } else if (response.status === ERROR_RESPONSE) {
        throw new Error(errorMessage || `Car with id ${id} was not found in the garage`);
      } else {
        throw new Error(`Failed to ${status} engine. Status: ${response.status}`);
      }
    }

    const data: EngineResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Error while ${status} engine for car ${id}`);
  }
}
