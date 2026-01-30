import { generateId } from '@/utils/generate-id';

import type { WebsocketRequest, WebsocketRequestMap } from '@/types/types';

export function createRequest<T extends keyof WebsocketRequestMap>(
  type: T,
  payload: WebsocketRequestMap[T],
): WebsocketRequest<T> {
  return {
    id: generateId(),
    type,
    payload,
  };
}
