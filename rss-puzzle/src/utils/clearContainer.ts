export function clearContainer(container: HTMLElement): void {
  while (container.firstChild) {
    container.firstChild.remove();
  }
}
