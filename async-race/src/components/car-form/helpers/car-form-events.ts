import { appState } from '@state/app-state';
import { eventState } from '@state/events/event-state';

export function updateFormEvents(
  nameInput: HTMLInputElement,
  colorInput: HTMLInputElement,
  syncDisabledState: () => void,
): void {
  eventState.on('updateform:fill', (payload) => {
    if (!payload) {
      return;
    }

    appState.updateForm = {
      id: payload.id,
      name: payload.name,
      color: payload.color,
      isDisabled: false,
    };

    nameInput.value = payload.name;
    colorInput.value = payload.color;
    syncDisabledState();
  });

  eventState.on('car:deleted', (deletedId) => {
    if (deletedId === undefined) {
      return;
    }

    if (appState.updateForm.id === deletedId) {
      eventState.emit('updateform:reset');
    }
  });

  eventState.on('updateform:reset', () => {
    appState.updateForm = {
      id: undefined,
      name: '',
      color: '#000000',
      isDisabled: true,
    };

    nameInput.value = '';
    colorInput.value = '#000000';
    syncDisabledState();
  });
}
