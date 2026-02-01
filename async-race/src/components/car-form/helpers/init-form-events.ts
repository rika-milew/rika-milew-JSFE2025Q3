import { createFormState } from '@/components/car-form/helpers/car-form-state';
import { appState } from '@/state/app-state';

export function initFormEvents(
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

  const { syncDisabledState }: { syncDisabledState: () => void } = createFormState(
    isUpdate,
    nameInput,
    colorInput,
    button,
  );

  syncDisabledState();

  return { syncDisabledState };
}
