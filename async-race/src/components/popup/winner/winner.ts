import { createPopup } from '../popup';

import './winner.css';

export const winnerPopup = createPopup({
  overlayClass: 'winner-overlay',
  containerClass: 'winner',
  headingContent: '🏁 Race Finished!',
  imageSrc: '/winner-cup.svg',
  imageAlt: 'Winner Icon',
  animationDuration: 3000,
  messageContent: (name) => `The winner is ${name}!`,
});
