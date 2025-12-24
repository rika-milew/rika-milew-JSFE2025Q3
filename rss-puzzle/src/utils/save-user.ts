import { isUser } from '../types/type-guards';

export function saveUserCredentials(firstName: string, surname: string): void {
  const user = {
    firstName,
    surname,
  };
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUserCredentials(
  firstNameInput: HTMLInputElement,
  surnameInput: HTMLInputElement,
): void {
  const savedUser = localStorage.getItem('user');

  if (savedUser) {
    const parsed = JSON.parse(savedUser);

    if (isUser(parsed)) {
      firstNameInput.value = parsed.firstName;
      surnameInput.value = parsed.surname;
    }
  }
}
