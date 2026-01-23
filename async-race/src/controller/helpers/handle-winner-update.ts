import { eventState } from '@/state/events/event-state';
import { winnersState } from '@/state/winners-state';

export function handleWinnerUpdate(payload?: { id: number; name: string; color: string }): void {
  if (!payload) {
    return;
  }

  const existing = winnersState.getById(payload.id);
  if (!existing) {
    return;
  }

  winnersState.update({
    ...existing,
    name: payload.name,
    color: payload.color,
  });

  eventState.emit('winner:updated');
}
