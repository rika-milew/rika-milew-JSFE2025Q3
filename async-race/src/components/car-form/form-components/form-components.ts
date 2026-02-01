import { createElement } from '@/utils/create-element';

import type { CarFormElements } from '@/types/types';

export function createFormComponents(isUpdate: boolean): CarFormElements {
  const carForm: HTMLFormElement = createElement({ tag: 'form', className: ['car-form'] });

  const nameInput: HTMLInputElement = createElement({
    tag: 'input',
    attributes: { placeholder: 'Car Name', type: 'text' },
  });

  const colorInput: HTMLInputElement = createElement({
    tag: 'input',
    attributes: { type: 'color', value: '#000000' },
  });

  nameInput.id = 'car-name';
  colorInput.id = 'car-color';

  const button: HTMLButtonElement = createElement({
    tag: 'button',
    textContent: isUpdate ? 'Update' : 'Create',
    attributes: { type: 'submit' },
  });

  carForm.append(nameInput, colorInput, button);

  return {
    carForm,
    nameInput,
    colorInput,
    button,
  };
}
