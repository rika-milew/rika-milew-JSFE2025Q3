import { eventState } from '../../state/event-state';
import { createElement } from '../../utils/create-element';
import { showError } from '../../utils/show-error';

import type { CarForm } from '../../types/types';

import './car-form.css';

export function createCarForm({ isUpdate = false, disabled = false }: CarForm): HTMLFormElement {
  const carForm = createElement({ tag: 'form', className: 'car-form' });

  const nameInput = createElement({
    tag: 'input',
    attributes: { placeholder: 'Car Name', type: 'text' },
  });

  const colorInput = createElement({
    tag: 'input',
    attributes: { type: 'color', value: '#000000' },
  });

  nameInput.id = 'car-name;';
  colorInput.id = 'car-color';

  colorInput.addEventListener('input', () => {
    if (!carForm.dataset.carId) {
      return;
    }

    eventState.emit('updateform:color', {
      id: Number(carForm.dataset.carId),
      color: colorInput.value,
    });
  });

  const button = createElement({
    tag: 'button',
    textContent: isUpdate ? 'Update' : 'Create',
    attributes: { type: 'submit' },
  });

  const errorText = createElement({ tag: 'p', className: 'error-text' });

  resetForm();

  function resetForm(): void {
    nameInput.disabled = disabled;
    colorInput.disabled = disabled;
    button.disabled = disabled;
  }

  carForm.append(nameInput, colorInput, button, errorText);

  if (isUpdate) {
    eventState.on('updateform:fill', (payload) => {
      if (!payload) {
        return;
      }

      carForm.dataset.carId = String(payload.id);
      nameInput.value = payload.name;
      colorInput.value = payload.color;
      nameInput.disabled = false;
      colorInput.disabled = false;
      button.disabled = false;
    });

    eventState.on('car:deleted', (deletedId) => {
      if (deletedId === undefined) {
        return;
      }

      if (carForm.dataset.carId === String(deletedId)) {
        eventState.emit('updateform:reset');
      }
    });

    eventState.on('updateform:reset', () => {
      carForm.dataset.carId = '';
      nameInput.value = '';
      colorInput.value = '#000000';
      resetForm();
    });
  }

  carForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!nameInput.value.trim()) {
      const ANIMATION_DURATION = 2000;
      showError(errorText, 'Enter car name', ANIMATION_DURATION);
      return;
    }
    errorText.textContent = '';

    if (isUpdate) {
      const id = Number(carForm.dataset.carId);

      if (!id) {
        return;
      }
      eventState.emit('car:update', { id, name: nameInput.value, color: colorInput.value });
      nameInput.disabled = true;
      colorInput.disabled = true;
      button.disabled = true;
    } else {
      eventState.emit('car:create', { name: nameInput.value, color: colorInput.value });
      nameInput.value = '';
      colorInput.value = '#000000';
    }
  });

  return carForm;
}
