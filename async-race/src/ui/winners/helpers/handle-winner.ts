import { eventState } from '@state/events/event-state';

import type { Car } from '@/types/types';

export function handleWinner(car: Car, time: number): void {
  eventState.emit('winner:add', {
    id: car.id,
    name: car.name,
    color: car.color,
    time,
    wins: 1,
  });
}
