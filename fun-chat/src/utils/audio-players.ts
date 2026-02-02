import type { SoundTypes, AudioPlayer } from '@/types/types';

export const audioPLayer: AudioPlayer = ((): AudioPlayer => {
  const sounds: Record<SoundTypes, HTMLAudioElement> = {
    notification: new Audio('sounds/notification.mp3'),
    button: new Audio('sounds/button.mp3'),
  };

  sounds.notification.volume = 0.7;
  sounds.button.volume = 0.5;

  const activeSounds: Set<SoundTypes> = new Set<SoundTypes>();

  const STORAGE_KEY = 'audio';

  const saved: string | null = localStorage.getItem(STORAGE_KEY);
  let isMuted: boolean = saved ? saved === 'true' : false;

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

  function playOnce(id: SoundTypes): void {
    if (isMuted) {
      return;
    }

    const sound: HTMLAudioElement = sounds[id];
    safePlay(sound);
  }

  function stopSound(id: SoundTypes): void {
    const sound: HTMLAudioElement = sounds[id];
    sound.pause();
    sound.currentTime = 0;
    activeSounds.delete(id);
  }

  function stopAllSounds(): void {
    activeSounds.forEach((id) => {
      stopSound(id);
    });
  }

  return {
    stopSound,
    stopAllSounds,
    toggleMute,
    get isMuted(): boolean {
      return isMuted;
    },
    playOnce,
  };
})();
