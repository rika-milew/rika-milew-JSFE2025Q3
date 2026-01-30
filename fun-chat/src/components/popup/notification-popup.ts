import { createPopup } from '@/components/popup/popup';

export const notificationPopup = createPopup({
  overlayClass: 'popup-overlay',
  containerClass: 'popup notification-popup',
  headingContent: 'Notification',
  imageSrc: 'icons/todo.svg',
  imageAlt: 'Notification',
  animationDuration: 2000,
});
