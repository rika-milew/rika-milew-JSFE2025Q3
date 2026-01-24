import { createPopup } from '@/components/popup/popup';

import './winner.css';

export const winnerPopup = createPopup({
  overlayClass: 'winner-overlay',
  containerClass: 'winner',
  headingContent: '🏁 Race Finished!',
  imageSrc: 'icons/winner-cup.svg',
  imageAlt: 'Winner Icon',
  animationDuration: 3500,
  messageContent: (name) => `The winner is ${name}!`,
});
