type SoundType = 'click' | 'correct' | 'level' | 'lose' | 'move';

const sounds: Record<SoundType, HTMLAudioElement> = {
  click: new Audio('sounds/button.mp3'),
  correct: new Audio('sounds/correct.mp3'),
  level: new Audio('sounds/level.mp3'),
  lose: new Audio('sounds/lose.mp3'),
  move: new Audio('sounds/move.mp3'),
};

Object.values(sounds).forEach((audio) => {
  audio.volume = 0.4;
  audio.preload = 'auto';
});

export function playSound(name: SoundType): void {
  const audio = sounds[name];
  audio.currentTime = 0;

  audio.play().catch((error: unknown) => {
    console.error(error);
  });
}
