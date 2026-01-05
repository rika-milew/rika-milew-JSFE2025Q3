import { isUser } from '../../types/type-guards';
import { createElement } from '../../utils/create-element';

export function createGreeting(container: HTMLElement): HTMLDivElement | undefined {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(savedUser);

    if (!isUser(parsed)) {
      return undefined;
    }

    const { firstName, surname } = parsed;

    if (!firstName.trim() || !surname.trim()) {
      return undefined;
    }

    const greeting = createElement({
      tag: 'div',
      className: 'start__greeting',
      textContent: `Hello, ${parsed.firstName} ${parsed.surname}!`,
    });

    container.append(greeting);
    return greeting;
  } catch {
    return undefined;
  }
}
