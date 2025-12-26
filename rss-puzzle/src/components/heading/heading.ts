import { HEADING_TEMPLATES } from '../../configs/heading.config';
import { createElement } from '../../utils/create-element';

type TemplateKey = keyof typeof HEADING_TEMPLATES;

import './heading.css';

export function createHeading(template: TemplateKey, text: string): HTMLElement {
  const config = HEADING_TEMPLATES[template];

  return createElement({
    tag: config.tag,
    className: config.className,
    textContent: text,
  });
}
