import { createPopup } from '@/components/popup/popup';

import './error.css';

export const errorPopup: { show: (message: string) => void } = createPopup({
  overlayClass: 'error-overlay',
  containerClass: 'error',
  headingContent: 'Error',
  imageSrc: 'icons/error-icon.svg',
  animationDuration: 2000,
});
