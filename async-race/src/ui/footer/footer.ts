import { createElement } from '../../utils/create-element';

import './footer.css';

export function createHeader(): void {
  const footer = createElement({ tag: 'footer', className: 'footer' });
  document.body.append(footer);
}
