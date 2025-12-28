import { eventState } from '../pages/game/event-state';
import '../pages/game/game-controller';

let currentAudio: HTMLAudioElement | undefined;

eventState.on('audio:update', (audioPath: string) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    eventState.emit('pronunciation:state', 'pause');
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
    currentAudio.pause();
    currentAudio.currentTime = 0;
    eventState.emit('pronunciation:state', 'pause');
    currentAudio = undefined;
  }
});
