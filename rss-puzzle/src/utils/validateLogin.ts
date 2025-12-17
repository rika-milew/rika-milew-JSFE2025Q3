const loginPattern = /^[A-Za-z-]+$/;
const firstLoginLetter = /^[A-Z]/;

const MIN_LENGTHS: Record<string, number> = {
  name: 3,
  surname: 4,
};

export function inputValidation(value: string, input: 'name' | 'surname'): string | undefined {
  const minLength = MIN_LENGTHS[input] ?? 0;
  if (value.length < minLength) {
    return `Please enter at least ${minLength} characters`;
  }
  if (!loginPattern.test(value)) {
    return 'Please use only letters A-Z and the hyphen (-)';
  }
  if (!firstLoginLetter.test(value)) {
    return 'Please capitalize the first letter';
  }
  return undefined;
}

export function showInputErrors(input: HTMLInputElement, errorMessage?: string): void {
  let error = input.nextElementSibling;

  if (!(error instanceof HTMLSpanElement)) {
    error = document.createElement('span');
    error.className = 'login__error';
    input.after(error);
  }

  if (!error.classList.contains('login__error')) {
    error = document.createElement('span');
    error.className = 'login__error';
    input.after(error);
  }

  if (errorMessage) {
    error.textContent = errorMessage;
    input.classList.add('login__input_error');
  } else {
    error.textContent = '';
    input.classList.remove('login__input_error');
  }
}
