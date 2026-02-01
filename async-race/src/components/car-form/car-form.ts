import { createFormComponents } from '@/components/car-form/form-components/form-components';
import { initFormEvents } from '@/components/car-form/helpers/init-form-events';
import { updateFormEvents } from '@/components/car-form/helpers/update-form-events';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { appState } from '@/state/app-state';
import { eventState } from '@/state/events/event-state';
import { garageList } from '@/ui/garage/helpers/garage-list';

import type { CarForm } from '@/types/types';

import './car-form.css';

export function createCarForm({ isUpdate = false }: CarForm): HTMLFormElement {
  const { carForm, nameInput, colorInput, button } = createFormComponents(isUpdate);

  const { syncDisabledState } = initFormEvents(isUpdate, nameInput, colorInput, button);

  if (isUpdate) {
    updateFormEvents(nameInput, colorInput, syncDisabledState);
  }

  carForm.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    if (!nameInput.value.trim()) {
      errorPopup.show(POPUP_MESSAGES.carFormFailed());
      return;
    }

    if (isUpdate) {
      handleUpdateForm(nameInput, colorInput, syncDisabledState);
    } else {
      handleCreateForm(nameInput, colorInput);
    }
  });

  return carForm;
}

function handleUpdateForm(
  nameInput: HTMLInputElement,
  colorInput: HTMLInputElement,
  syncDisabledState: () => void,
): void {
  const id: number | undefined = appState.updateForm.id;

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

  garageList.render();

  appState.updateForm.isDisabled = true;
  syncDisabledState();
}

function handleCreateForm(nameInput: HTMLInputElement, colorInput: HTMLInputElement): void {
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
