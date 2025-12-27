import { eventState } from '../pages/game/event-state';

export function playAudio(audioPath: string, icon: HTMLElement): void {
  const audio = new Audio(audioPath);

  audio.play().catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Audio playback error:', error.message);
    } else {
      console.error('Audio playback error:', error);
    }
  });

  icon.classList.add('playing');

  audio.addEventListener('ended', () => {
    icon.classList.remove('playing');
  });

  eventState.emit('pronunciation:play', audioPath);
}
