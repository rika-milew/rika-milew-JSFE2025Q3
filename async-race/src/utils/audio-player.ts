import type { SoundTypes, AudioPlayer } from '@/types/types';

export const audioPLayer: AudioPlayer = ((): AudioPlayer => {
  const sounds: Record<SoundTypes, HTMLAudioElement> = {
    race: new Audio('sounds/race.mp3'),
    brake: new Audio('sounds/brake.mp3'),
    button: new Audio('sounds/button.mp3'),
  };

  sounds.race.loop = true;
  sounds.race.volume = 0.3;
  sounds.brake.volume = 0.3;
  sounds.button.volume = 0.5;

  const activeSounds = new Set<SoundTypes>();

  const STORAGE_KEY = 'audio';

  const saved = localStorage.getItem(STORAGE_KEY);
  let isMuted = saved ? saved === 'true' : false;

  function updateMute(): void {
    Object.values(sounds).forEach((sound) => {
      sound.muted = isMuted;
    });
  }

  updateMute();

  function safePlay(sound: HTMLAudioElement): void {
    sound.currentTime = 0;

    sound.play().catch((error: unknown) => {
      if (error instanceof Error) {
        console.error('Audio play failed:', error.message);
      } else {
        console.error('Audio play failed:', error);
      }
    });
  }

  function toggleMute(): void {
    isMuted = !isMuted;
    localStorage.setItem(STORAGE_KEY, isMuted.toString());
    updateMute();
  }

  function playSound(id: SoundTypes): void {
    if (isMuted) {
      return;
    }

    const sound = sounds[id];
    safePlay(sound);
    activeSounds.add(id);
  }

  function stopSound(id: SoundTypes): void {
    const sound = sounds[id];
    sound.pause();
    sound.currentTime = 0;
    activeSounds.delete(id);
  }

  function stopAllSounds(): void {
    activeSounds.forEach((id) => {
      stopSound(id);
    });
  }

  function playOnce(id: SoundTypes): void {
    if (isMuted) {
      return;
    }

    const sound = sounds[id];
    safePlay(sound);
  }

  function playRaceLoop(): void {
    if (isMuted) {
      return;
    }

    const raceSound = sounds.race;
    if (!raceSound.paused) {
      return;
    }

    safePlay(raceSound);
    activeSounds.add('race');
  }

  function stopRaceLoop(): void {
    stopSound('race');
  }

  return {
    playSound,
    stopSound,
    stopAllSounds,
    toggleMute,
    get isMuted(): boolean {
      return isMuted;
    },
    playOnce,
    playRaceLoop,
    stopRaceLoop,
  };
})();
