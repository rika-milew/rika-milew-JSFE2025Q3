import type { WinnersStateType, WinnersStateItem } from '@/types/types';

export const winnersState: WinnersStateType = {
  winners: {},
  totalWinners: 0,

  set(winners: WinnersStateItem[]) {
    this.winners = {};
    winners.forEach((w) => {
      this.winners[w.id] = w;
    });
  },

  add(winner: WinnersStateItem) {
    this.winners[winner.id] = winner;
    this.totalWinners += 1;
  },

  update(winner: WinnersStateItem) {
    this.winners[winner.id] = winner;
  },

  remove(id: number) {
    this.winners = Object.fromEntries(
      Object.entries(this.winners).filter(([key]) => Number(key) !== id),
    );
    this.totalWinners -= 1;
  },

  getById(id: number) {
    return this.winners[id];
  },
};
