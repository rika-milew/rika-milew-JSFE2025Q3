import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { EngineResponse } from '@/types/types';

export async function startEngine(
  id: number,
  status: 'started' | 'stopped' | 'drive',
): Promise<EngineResponse | undefined> {
  const url = `${API_URL}/engine?id=${id}&status=${status}`;
  return fetchData<EngineResponse>(url, { method: 'PATCH' });
}
