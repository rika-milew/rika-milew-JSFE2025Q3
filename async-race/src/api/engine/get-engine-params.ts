import { API_URL, BAD_REQUEST, ERROR_RESPONSE, MANY_REQUESTS, SERVER_ERROR } from '@data/constants';

import type { DriveResponse } from '@/types/types';

export async function getEngineParams(id: number): Promise<DriveResponse> {
  try {
    const url = new URL(`${API_URL}/engine`);
    url.searchParams.append('id', id.toString());
    url.searchParams.append('status', 'drive');

    const response = await fetch(url.toString(), { method: 'PATCH' });

    if (!response.ok) {
      const errorMessage = await response.text();

      switch (response.status) {
        case BAD_REQUEST: {
          throw new Error(errorMessage || 'Wrong parameters');
        }
        case ERROR_RESPONSE: {
          throw new Error(
            errorMessage || `Engine parameters for car with such ${id} was not found in the garage`,
          );
        }
        case MANY_REQUESTS: {
          throw new Error(errorMessage || `Drive already in progress for car ${id}`);
        }
        case SERVER_ERROR: {
          throw new Error(
            errorMessage || "Car has been stopped suddenly. It's engine was broken down.",
          );
        }
        default: {
          throw new Error(`Failed to drive car ${id}. Status: ${response.status}`);
        }
      }
    }

    const data: DriveResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Error while driving the car ${id}`);
  }
}
