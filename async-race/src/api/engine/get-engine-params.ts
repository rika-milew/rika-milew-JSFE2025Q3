import { fetchData } from '@/api/fetch-data';
import { API_URL } from '@/data/constants';

import type { DriveResponse } from '@/types/types';

export async function getEngineParams(id: number): Promise<DriveResponse | undefined> {
  const url = `${API_URL}/engine?id=${id}&status=drive`;
  return fetchData<DriveResponse>(url, { method: 'PATCH' });
}
