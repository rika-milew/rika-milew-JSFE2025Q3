export function startApp(root: HTMLElement): void {
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  root.append(mainContainer);
}
