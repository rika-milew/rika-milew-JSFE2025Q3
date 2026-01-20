import { createElement } from '@utils/create-element';

import type { CarFormElements } from '@/types/types';

export function createCarFormElements(isUpdate: boolean): CarFormElements {
  const carForm = createElement({ tag: 'form', className: ['car-form'] });

  const nameInput = createElement({
    tag: 'input',
    attributes: { placeholder: 'Car Name', type: 'text' },
  });

  const colorInput = createElement({
    tag: 'input',
    attributes: { type: 'color', value: '#000000' },
  });

  nameInput.id = 'car-name';
  colorInput.id = 'car-color';

  const button = createElement({
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
