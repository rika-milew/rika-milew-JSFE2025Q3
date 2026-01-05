import { createHint } from '../../../components/hint/hint';
import { createElement } from '../../../utils/create-element';

import type { HintIcons, HintContainer } from '../../../types/types';

export function createHintIcons(): HintIcons {
  const hintIcons = createElement({ tag: 'div', className: 'hint-icons' });

  const translationIcon = createHint({
    container: hintIcons,
    text: 'Translation',
    icon: 'icons/translation.svg',
    className: 'hint',
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

  hintIcons.append(translationIcon, pronunciationIcon, imageIcon);

  return { hintIcons, translationIcon, pronunciationIcon, imageIcon };
}

export function createHintContainer(): HintContainer {
  const hintContainer = createElement({ tag: 'div', className: 'hint-container' });

  const translation = createElement({ tag: 'div', className: 'translation' });

  const audioIcon = createHint({
    container: hintContainer,
    text: 'Play audio',
    icon: 'icons/audio-play.svg',
    className: 'hint audio',
  });

  hintContainer.append(translation, audioIcon);

  return { hintContainer, translation, audioIcon };
}
