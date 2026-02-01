import { engineButtons } from '@/state/engine-buttons-state';

import type { EngineButtons } from '@/types/types';

export function setEngineButtons(carId: number, startEnabled: boolean, stopEnabled: boolean): void {
  const buttons: EngineButtons = engineButtons[carId];

  buttons.startButton.disabled = !startEnabled;
  buttons.resetButton.disabled = !stopEnabled;
}
