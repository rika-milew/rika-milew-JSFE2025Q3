import { createPopup } from '@/components/popup/popup';

export const errorPopup = createPopup({
  overlayClass: 'popup-overlay',
  containerClass: 'popup',
  headingContent: 'Error',
  imageSrc: '',
  imageAlt: '',
  animationDuration: 2000,
});
