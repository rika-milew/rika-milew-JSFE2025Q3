import { createWinner } from '@api/winners/create-winner';
import { updateWinner } from '@api/winners/update-winner';
import { errorPopup } from '@components/popup/error/error';

import type { Car, Winner } from '@/types/types';

type WinnersStateItem = Winner;

type WinnersStateType = {
  winners: Record<number, WinnersStateItem>;
  set(winners: Winner[]): void;
  getWinner(carId: number): WinnersStateItem | undefined;
  addToState(winner: Winner): void;
  add(car: Car, time: number): Promise<void>;
};

export const winnersState: WinnersStateType = {
  winners: {},

  set(winners: Winner[]): void {
    this.winners = {};
    winners.forEach((winner) => {
      this.winners[winner.id] = winner;
    });
  },

  getWinner(carId: number): WinnersStateItem | undefined {
    return this.winners[carId];
  },

  addToState(winner: Winner): void {
    this.winners[winner.id] = winner;
  },

  async add(car: Car, time: number): Promise<void> {
    const currentWinner = this.getWinner(car.id);

    try {
      if (currentWinner) {
        currentWinner.wins += 1;
        currentWinner.time = Math.min(currentWinner.time, time);
        const updatedWinner = await updateWinner(car.id, currentWinner.wins, currentWinner.time);
        this.addToState(updatedWinner);
      } else {
        const newWinner = await createWinner(car.id, 1, time);
        this.addToState(newWinner);
      }
    } catch {
      errorPopup.show(`Failed to add winner for the car ${car.id}`);
    }
  },
};
