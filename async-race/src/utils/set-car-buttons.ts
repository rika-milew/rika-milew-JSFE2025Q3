import { engineButtons } from '@/state/engine-buttons-state';

export function setEngineButtons(carId: number, startEnabled: boolean, stopEnabled: boolean): void {
  const buttons = engineButtons[carId];

  buttons.startButton.disabled = !startEnabled;
  buttons.resetButton.disabled = !stopEnabled;
}
