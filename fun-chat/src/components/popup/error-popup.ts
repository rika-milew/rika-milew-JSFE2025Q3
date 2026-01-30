import { createPopup } from '@/components/popup/popup';

export const errorPopup = createPopup({
  overlayClass: 'popup-overlay',
  containerClass: 'popup',
  headingContent: 'Error',
  imageSrc: 'icons/closecircle.svg',
  imageAlt: 'Error',
  animationDuration: 2000,
});
