import { createPopup } from '@/components/popup/popup';

import './error.css';

export const errorPopup = createPopup({
  overlayClass: 'error-overlay',
  containerClass: 'error',
  headingContent: 'Error',
  imageSrc: 'icons/error-icon.svg',
  imageAlt: 'Error Icon',
  animationDuration: 2000,
});
