import { createMuteButton } from '@/components/mute-button/mute-button';
import { createButton } from '@/components/shared/button/button';
import { appState } from '@/state/app-state';
import { eventState } from '@/state/events/event-state';
import { createElement } from '@/utils/create-element';

import './header.css';

export function createHeader(): void {
  const header: HTMLElement = createElement({ tag: 'header', className: ['header'] });

  const title: HTMLHeadingElement = createElement({
    tag: 'h1',
    className: ['title'],
    textContent: 'Async Race',
  });

  const settings: HTMLDivElement = createElement({ tag: 'div', className: ['settings'] });

  const muteButton: HTMLDivElement = createMuteButton();

  const nav: HTMLElement = createElement({ tag: 'nav', className: ['nav'] });

  const garageNav: HTMLButtonElement = createButton({
    text: 'To Garage',
    className: `garage-button ${appState.view === 'garage' ? 'active' : ''}`,
    disabled: appState.view === 'garage',
  });

  garageNav.addEventListener('click', () => {
    eventState.emit('view:changed', 'garage');
  });

  const winnersNav: HTMLButtonElement = createButton({
    text: 'To Winners',
    className: `winners-button ${appState.view === 'winners' ? 'active' : ''}`,
    disabled: appState.view === 'winners',
  });

  winnersNav.addEventListener('click', () => {
    eventState.emit('view:changed', 'winners');
  });

  settings.append(nav, muteButton);
  header.append(title, settings);
  nav.append(garageNav, winnersNav);

  document.body.append(header);
}
