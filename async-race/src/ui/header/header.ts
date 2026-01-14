import { createButton } from '@components/button/button';
import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';
import { createElement } from '@utils/create-element';

import './header.css';

export function createHeader(): void {
  const header = createElement({ tag: 'header', className: ['header'] });

  const title = createElement({ tag: 'h1', className: ['title'], textContent: 'Async Race' });

  const nav = createElement({ tag: 'nav', className: ['nav'] });

  const garageNav = createButton({
    text: 'To Garage',
    className: `garage-button ${appState.view === 'garage' ? 'active' : ''}`,
    disabled: appState.view === 'garage',
  });
  garageNav.addEventListener('click', () => {
    eventState.emit('view:changed', 'garage');
  });

  const winnersNav = createButton({
    text: 'To Winners',
    className: `winners-button ${appState.view === 'winners' ? 'active' : ''}`,
    disabled: appState.view === 'winners',
  });

  winnersNav.addEventListener('click', () => {
    eventState.emit('view:changed', 'winners');
  });

  header.append(title, nav);
  nav.append(garageNav, winnersNav);

  document.body.append(header);
}
