import { API_URL } from '@/constants/constants';

import type { EngineResponse, DriveResponse } from '@/types/types';

export async function getEngineStatus<T extends EngineResponse | DriveResponse>(
  id: number,
  status: 'started' | 'stopped' | 'drive',
): Promise<T | undefined> {
  const url = `${API_URL}/engine?id=${id}&status=${status}`;

  try {
    const response: Response = await fetch(url, { method: 'PATCH' });

    if (!response.ok) {
      return undefined;
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to get engine status for car ${id}`, error);
    return undefined;
  }
}
