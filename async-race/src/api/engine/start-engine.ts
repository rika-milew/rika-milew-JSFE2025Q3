import { API_URL } from '@data/constants';

import { getApiError } from '../get-api-error';

import type { EngineResponse } from '../../types/types';

export async function startEngine(
  id: number,
  status: 'started' | 'stopped' | 'drive',
): Promise<EngineResponse> {
  const url = new URL(`${API_URL}/engine`);
  url.searchParams.append('id', id.toString());
  url.searchParams.append('status', status);

  const response = await fetch(url.toString(), { method: 'PATCH' });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || getApiError(response.status, id));
  }

  const data: EngineResponse = await response.json();
  return data;
}
