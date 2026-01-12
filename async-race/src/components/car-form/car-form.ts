import { createCarFormElements } from './helpers/car-form-elements';
import { initUpdateFormEvents } from './helpers/car-form-events';
import { createFormState } from './helpers/car-form-state';
import { appState } from '../../state/app-state';
import { eventState } from '../../state/event-state';
import { garageList } from '../../ui/garage/garage-list';
import { createErrorPopup } from '../error/error';

import type { CarForm } from '../../types/types';

import './car-form.css';

export function createCarForm({ isUpdate = false }: CarForm): HTMLFormElement {
  const { carForm, nameInput, colorInput, button, errorText } = createCarFormElements(isUpdate);

  const errorPopup = createErrorPopup();

  nameInput.addEventListener('input', () => {
    if (!isUpdate) {
      appState.createForm.name = nameInput.value;
    }
  });

  colorInput.addEventListener('input', () => {
    if (!isUpdate) {
      appState.createForm.color = colorInput.value;
    }
  });

  const { syncDisabledState } = createFormState(isUpdate, nameInput, colorInput, button);

  syncDisabledState();

  if (isUpdate) {
    initUpdateFormEvents(nameInput, colorInput, syncDisabledState);
  }

  carForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!nameInput.value.trim()) {
      errorPopup.show('Please, enter car name');
      return;
    }
    errorText.textContent = '';

    if (isUpdate) {
      const id = appState.updateForm.id;

      if (!id) {
        return;
      }

      appState.updateForm.name = nameInput.value;
      appState.updateForm.color = colorInput.value;

      eventState.emit('car:update', {
        id,
        name: appState.updateForm.name,
        color: appState.updateForm.color,
      });

      try {
        await garageList.render();
      } catch {
        errorPopup.show('Failed to update the chosen car');
      }

      appState.updateForm.isDisabled = true;
      syncDisabledState();
    } else {
      eventState.emit('car:create', {
        name: appState.createForm.name,
        color: appState.createForm.color,
      });

      appState.createForm = {
        name: '',
        color: '#000000',
      };

      nameInput.value = '';
      colorInput.value = '#000000';
    }
  });

  return carForm;
}
