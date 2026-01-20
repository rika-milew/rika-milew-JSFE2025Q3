import { getApiError } from '@api/get-api-error';
import { API_URL } from '@data/constants';

import type { DriveResponse } from '@/types/types';

export async function getEngineParams(id: number): Promise<DriveResponse> {
  const url = new URL(`${API_URL}/engine`);
  url.searchParams.append('id', id.toString());
  url.searchParams.append('status', 'drive');

  const response = await fetch(url.toString(), { method: 'PATCH' });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || getApiError(response.status, id));
  }

  const data: DriveResponse = await response.json();
  return data;
}
