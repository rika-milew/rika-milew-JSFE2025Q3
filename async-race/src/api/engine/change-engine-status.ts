import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { EngineResponse, DriveResponse } from '@/types/types';

export async function changeEngineStatus<T extends EngineResponse | DriveResponse>(
  id: number,
  status: 'started' | 'stopped' | 'drive',
): Promise<T | undefined> {
  const url = `${API_URL}/engine?id=${id}&status=${status}`;
  return fetchData<T>(url, { method: 'PATCH' });
}
