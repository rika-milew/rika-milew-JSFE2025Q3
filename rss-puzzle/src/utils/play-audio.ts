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

    currentAudio.currentTime = 0;

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
    if (!currentAudio) {
      return;
    }
    currentAudio.pause();
    currentAudio.currentTime = 0;

    eventState.emit('pronunciation:state', 'pause');
  });
}

export function playResultsAudio(): void {
  let currentAudio: HTMLAudioElement | undefined;

  function stop(): void {
    if (!currentAudio) {
      return;
    }

    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = undefined;
  }

  eventState.on('results:audio', (audioSource: string) => {
    stop();

    currentAudio = new Audio(audioSource);
    currentAudio.play().catch(console.error);

    currentAudio.addEventListener(
      'ended',
      () => {
        currentAudio = undefined;
      },
      { once: true },
    );
  });
}
