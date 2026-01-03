import { hintState } from './hint-state';
import { createHint } from '../../../components/hint/hint';
import { createElement } from '../../../utils/create-element';
import { eventState } from '../event-state';

import type { Sentence } from '../../../types/types';

export function createHints(currentSentence: Sentence): {
  hintIcons: HTMLElement;
  hintContainer: HTMLElement;
} {
  const hintIcons = createElement({ tag: 'div', className: 'hint-icons' });

  const translationIcon = createHint({
    container: hintIcons,
    text: 'Translation',
    icon: 'icons/translation.svg',
    className: 'hint',
  });

  const hintContainer = createElement({ tag: 'div', className: 'hint-container' });

  const translation = createElement({
    tag: 'div',
    className: 'translation',
  });

  const pronunciationIcon = createHint({
    container: hintIcons,
    text: 'Pronunciation',
    icon: 'icons/audio.svg',
    className: 'hint',
  });

  const imageIcon = createHint({
    container: hintIcons,
    text: 'Show image',
    icon: 'icons/picture.svg',
    className: 'hint image',
  });

  const audioIcon = createHint({
    container: hintContainer,
    text: 'Play audio',
    icon: 'icons/audio-play.svg',
    className: 'hint audio',
  });

  hintIcons.append(translationIcon, pronunciationIcon, imageIcon);
  hintContainer.append(translation, audioIcon);

  eventState.on('hint:translation:toggle', (mode) => {
    translation.classList.toggle('visible', mode === 'enabled');
  });

  eventState.on('hint:audio:toggle', (mode) => {
    audioIcon.classList.toggle('visible', mode === 'enabled');
  });

  eventState.on('hint:image:toggle', (mode: 'enabled' | 'disabled') => {
    const wrappers = [...document.body.children].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element.classList.contains('word-wrapper'),
    );

    wrappers.forEach((wrapper) => {
      const isSolved = wrapper.classList.contains('correct');
      wrapper.classList.toggle('background', mode === 'enabled' || isSolved);
    });
  });

  eventState.on('translation:update', (text: string) => {
    translation.textContent = text;
  });

  translationIcon.classList.toggle('active', hintState.getMode('translation') === 'enabled');
  translation.classList.toggle('visible', hintState.getMode('translation') === 'enabled');

  pronunciationIcon.classList.toggle('active', hintState.getMode('audio') === 'enabled');
  audioIcon.classList.toggle('visible', hintState.getMode('audio') === 'enabled');

  imageIcon.classList.toggle('active', hintState.getMode('image') === 'enabled');

  translationIcon.addEventListener('click', () => {
    hintState.toggle('translation');
    translationIcon.classList.toggle('active', hintState.getMode('translation') === 'enabled');
    eventState.emit('hint:translation:toggle', hintState.getMode('translation'));
  });

  pronunciationIcon.addEventListener('click', () => {
    hintState.toggle('audio');
    const mode = hintState.getMode('audio');
    pronunciationIcon.classList.toggle('active', mode === 'enabled');
    eventState.emit('hint:audio:toggle', mode);
    if (mode === 'disabled') {
      eventState.emit('audio:reset', '');
    }
  });

  imageIcon.addEventListener('click', () => {
    hintState.toggle('image');
    imageIcon.classList.toggle('active', hintState.getMode('image') === 'enabled');
    eventState.emit('hint:image:toggle', hintState.getMode('image'));
  });

  eventState.emit('translation:update', currentSentence.textExampleTranslate);
  eventState.emit('hint:translation:toggle', hintState.getMode('translation'));
  eventState.emit('audio:update', currentSentence.audioExample);
  eventState.emit('hint:audio:toggle', hintState.getMode('audio'));
  eventState.emit('hint:image:toggle', hintState.getMode('image'));

  audioIcon.addEventListener('click', () => {
    eventState.emit('pronunciation:play', currentSentence.audioExample);
  });

  eventState.on('pronunciation:state', (state: 'playing' | 'pause') => {
    audioIcon.classList.toggle('playing', state === 'playing');
  });

  return { hintIcons, hintContainer };
}
