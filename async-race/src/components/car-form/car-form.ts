import { createCarFormElements } from '@components/car-form/helpers/car-form-elements';
import { updateFormEvents } from '@components/car-form/helpers/car-form-events';
import { createFormState } from '@components/car-form/helpers/car-form-state';
import { errorPopup } from '@components/popup/error/error';
import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';
import { garageList } from '@ui/garage/helpers/garage-list';

import type { CarForm } from '@/types/types';

import './car-form.css';

export function createCarForm({ isUpdate = false }: CarForm): HTMLFormElement {
  const { carForm, nameInput, colorInput, button, errorText } = createCarFormElements(isUpdate);

  const { syncDisabledState } = initCarFormEvents(isUpdate, nameInput, colorInput, button);

  if (isUpdate) {
    updateFormEvents(nameInput, colorInput, syncDisabledState);
  }

  carForm.addEventListener('submit', (event) => {
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

      appState.updateForm = {
        id: undefined,
        name: '',
        color: '#000000',
        isDisabled: true,
      };

      nameInput.value = '';
      colorInput.value = '#000000';

      try {
        garageList.render();
      } catch {
        errorPopup.show('Failed to update the chosen car — try again');
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

export function initCarFormEvents(
  isUpdate: boolean,
  nameInput: HTMLInputElement,
  colorInput: HTMLInputElement,
  button: HTMLButtonElement,
): { syncDisabledState: () => void } {
  nameInput.addEventListener('input', () => {
    if (isUpdate) {
      appState.updateForm.name = nameInput.value;
    } else {
      appState.createForm.name = nameInput.value;
    }
  });

  colorInput.addEventListener('input', () => {
    if (isUpdate) {
      appState.updateForm.color = colorInput.value;
    } else {
      appState.createForm.color = colorInput.value;
    }
  });

  const { syncDisabledState } = createFormState(isUpdate, nameInput, colorInput, button);
  syncDisabledState();

  return { syncDisabledState };
}
