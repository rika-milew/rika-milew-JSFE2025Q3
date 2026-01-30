import { createPopup } from '@/components/popup/popup';
import { eventState } from '@/store/events/event-state';

export function createConnectionPopup(): void {
  const popup = createPopup({
    overlayClass: 'popup-overlay',
    containerClass: 'popup connection-popup',
    headingContent: '',
    imageSrc: 'icons/turbo.svg',
    imageAlt: 'Connection',
    animationDuration: 3000,
    messageContent: (message) => message,
  });

  eventState.on('connection:changed', (state) => {
    if (!state) {
      return;
    }

    if (state.connected) {
      popup.show('Connection restored');
    } else {
      popup.show('Connection lost. Reconnecting...');
    }
  });
}
