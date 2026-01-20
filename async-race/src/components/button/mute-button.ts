import { audioPLayer } from '@utils/audio-player';
import { createElement } from '@utils/create-element';

export function createMuteButton(): HTMLDivElement {
  const button = createElement({
    tag: 'div',
    className: ['mute-button'],
  });

  if (audioPLayer.isMuted) {
    button.classList.add('mute-button_active');
  }

  button.addEventListener('click', () => {
    audioPLayer.toggleMute();
    button.classList.toggle('mute-button_active', audioPLayer.isMuted);
  });

  return button;
}
