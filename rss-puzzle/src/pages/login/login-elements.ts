import { createElement } from '../../utils/create-element';

export function createLabel(text: string, htmlFor: string): HTMLLabelElement {
  const label = createElement({
    tag: 'label',
    className: 'login__label',
    textContent: text,
    attributes: { htmlFor },
  });

  label.htmlFor = htmlFor;

  return label;
}

export function createTextInput(
  id: string,
  name: string,
  placeholder: string,
  className: string,
): HTMLInputElement {
  return createElement({
    tag: 'input',
    className,
    attributes: {
      id,
      placeholder,
      required: 'true',
      type: 'text',
      name,
    },
  });
}

export function createForm(id: string): HTMLFormElement {
  return createElement({
    tag: 'form',
    className: 'login__form',
    attributes: { id },
  });
}
