import { eventState } from '../pages/game/event-state';

export function playAudio(): void {
  let currentAudio: HTMLAudioElement | undefined;

  function stopAudio(): void {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      eventState.emit('pronunciation:state', 'pause');
      currentAudio = undefined;
    }
  }

  eventState.on('audio:update', (audioPath: string) => {
    if (currentAudio) {
      stopAudio();
    }
    currentAudio = new Audio(audioPath);
  });

  eventState.on('pronunciation:play', () => {
    if (!currentAudio) {
      return;
    }

    currentAudio.play().catch((error: unknown) => {
      console.error(error);
    });

    eventState.emit('pronunciation:state', 'playing');

    currentAudio.addEventListener(
      'ended',
      () => {
        eventState.emit('pronunciation:state', 'pause');
      },
      { once: true },
    );
  });

  eventState.on('audio:reset', () => {
    if (currentAudio) {
      stopAudio();
    }
  });
}
