import { createPopup } from '@/components/popup/popup';

import './winner.css';

export const winnerPopup: { show: (message: string) => void } = createPopup({
  overlayClass: 'winner-overlay',
  containerClass: 'winner',
  headingContent: '🏁 Race Finished!',
  imageSrc: 'icons/winner-cup.svg',
  animationDuration: 3500,
  messageContent: (name) => `The winner is ${name}!`,
});
