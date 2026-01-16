import { winnersState } from '@state/winners-state';

import type { Car } from '@/types/types';

export async function handleWinner(car: Car, time: number): Promise<void> {
  await winnersState.add(car, time);
}
