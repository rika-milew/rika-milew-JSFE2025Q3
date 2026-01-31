import { eventState } from '@/state/events/event-state';
import { winnersState } from '@/state/winners-state';

export function handleWinnerUpdate(payload?: { id: number; name: string; color: string }): void {
  if (!payload) {
    return;
  }

  const existingWinner = winnersState.getById(payload.id);
  if (!existingWinner) {
    return;
  }

  winnersState.update({
    ...existingWinner,
    name: payload.name,
    color: payload.color,
  });

  eventState.emit('winner:updated');
}
