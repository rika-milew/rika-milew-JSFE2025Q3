import { createButton } from '@/components/button/button';
import { eventState } from '@/store/events/event-state';
import { createElement } from '@/utils/create-element';

import type { PopupOptions, PopupElements, PopupController } from '@/types/types';

import './popups.css';

const AUTO_CLOSE_DURATION = 2000;

export function createPopup(options: PopupOptions): {
  show: (message: string, autoClose?: boolean, autoCloseDuration?: number) => void;
} {
  const elements = createPopupElements(options);
  return usePopup(elements, options);
}

function createPopupElements(options: PopupOptions): PopupElements {
  const { overlayClass, containerClass, headingContent, imageSrc, closeButton = true } = options;

  const overlay: HTMLDivElement = createElement({ tag: 'div', className: [overlayClass] });
  const container: HTMLDivElement = createElement({ tag: 'div', className: [containerClass] });

  if (headingContent) {
    const heading: HTMLHeadingElement = createElement({ tag: 'h2', textContent: headingContent });
    container.append(heading);
  }

  const content: HTMLParagraphElement = createElement({ tag: 'p' });
  container.append(content);

  if (imageSrc) {
    const image: HTMLImageElement = createElement({
      tag: 'img',
      attributes: { src: imageSrc, width: '100', height: '100' },
    });
    container.append(image);
  }

  let button: HTMLButtonElement | undefined;
  if (closeButton) {
    button = createButton({
      text: 'Close',
      className: 'popup-button',
    });
    container.append(button);
  }

  overlay.append(container);

  return { overlay, container, content, button };
}

function usePopup(elements: PopupElements, options: PopupOptions): PopupController {
  const { overlay, content, button } = elements;
  const { clickToClose = true, messageContent } = options;

  let timeout: ReturnType<typeof setTimeout> | undefined;

  function hide(): void {
    overlay.classList.remove('visible');
    content.textContent = '';
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  }

  if (clickToClose) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hide();
      }
    });
  }

  if (button) {
    button.addEventListener('click', hide);
  }

  function show(
    message: string,
    autoClose?: boolean,
    autoCloseDuration = AUTO_CLOSE_DURATION,
  ): void {
    if (!message) {
      return;
    }

    if (!document.body.contains(overlay)) {
      document.body.append(overlay);
    }

    content.textContent = messageContent ? messageContent(message) : message;

    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    if (timeout) {
      clearTimeout(timeout);
    }

    if (autoClose) {
      timeout = setTimeout(hide, autoCloseDuration);
    }
  }

  return { show };
}

let connectionPopup: PopupController | undefined;

export function createConnectionPopup(): PopupController {
  if (connectionPopup) {
    return connectionPopup;
  }

  const popup: PopupController = createPopup({
    overlayClass: 'popup-overlay',
    containerClass: 'popup connection-popup',
    imageSrc: 'icons/turbo.svg',
    clickToClose: false,
    closeButton: false,
    messageContent: (message) => message,
  });

  eventState.on('connection:changed', (state) => {
    if (!state) {
      return;
    }

    if (state.connected) {
      popup.show('Connection restored', true, AUTO_CLOSE_DURATION);
    } else {
      popup.show('Connection lost. Reconnecting...', false);
    }
  });

  connectionPopup = popup;
  return popup;
}

export const notificationPopup: PopupController = createPopup({
  overlayClass: 'popup-overlay',
  containerClass: 'popup notification-popup',
  headingContent: 'Notification',
  imageSrc: 'icons/todo.svg',
  clickToClose: true,
  closeButton: true,
});

export const errorPopup: PopupController = createPopup({
  overlayClass: 'popup-overlay',
  containerClass: 'popup',
  headingContent: 'Error',
  imageSrc: 'icons/error-svg.svg',
  clickToClose: true,
  closeButton: true,
});
