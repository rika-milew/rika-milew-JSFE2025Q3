import { createPopup } from '@/components/popup/popup';

import './winner.css';

export const winnerPopup = createPopup({
  overlayClass: 'winner-overlay',
  containerClass: 'winner',
  headingContent: '🏁 Race Finished!',
  imageSrc: '/winner-cup.svg',
  imageAlt: 'Winner Icon',
  animationDuration: 4000,
  messageContent: (name) => `The winner is ${name}!`,
});
