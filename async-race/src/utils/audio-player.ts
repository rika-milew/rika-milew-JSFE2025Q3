type SoundTypes = 'race' | 'brake' | 'button';

type AudioPlayer = {
  playSound: (id: SoundTypes) => void;
  stopSound: (id: SoundTypes) => void;
  stopAllSounds: () => void;
};

export const audioPLayer: AudioPlayer = ((): AudioPlayer => {
  const sounds: Record<SoundTypes, HTMLAudioElement> = {
    race: new Audio('/sounds/race.mp3'),
    brake: new Audio('/sounds/brake.mp3'),
    button: new Audio('/sounds/button.mp3'),
  };

  sounds.race.loop = true;
  sounds.race.volume = 0.3;
  sounds.brake.volume = 0.3;
  sounds.button.volume = 0.5;

  const activeSounds = new Set<SoundTypes>();

  function playSound(id: SoundTypes): void {
    void sounds[id].play();

    sounds[id].currentTime = 0;
    activeSounds.add(id);
  }

  function stopSound(id: SoundTypes): void {
    sounds[id].pause();
    sounds[id].currentTime = 0;
    activeSounds.delete(id);
  }

  function stopAllSounds(): void {
    activeSounds.forEach((id) => {
      stopSound(id);
    });
  }

  return { playSound, stopSound, stopAllSounds };
})();
