import { appState } from '@state/app-state';

export function createFormState(
  isUpdate: boolean,
  nameInput: HTMLInputElement,
  colorInput: HTMLInputElement,
  button: HTMLButtonElement,
): { syncDisabledState: () => void } {
  function syncDisabledState(): void {
    if (!isUpdate) {
      return;
    }

    nameInput.disabled = appState.updateForm.isDisabled;
    colorInput.disabled = appState.updateForm.isDisabled;
    button.disabled = appState.updateForm.isDisabled;
  }

  if (isUpdate) {
    nameInput.value = appState.updateForm.name;
    colorInput.value = appState.updateForm.color;
  } else {
    nameInput.value = appState.createForm.name;
    colorInput.value = appState.createForm.color;
  }

  return { syncDisabledState };
}
