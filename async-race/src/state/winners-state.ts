import type { Winner } from '@/types/types';

export type WinnersStateItem = Winner & { name: string; color: string };

export type WinnersStateType = {
  winners: Record<number, WinnersStateItem>;
  totalCount: number;
  set(winners: WinnersStateItem[]): void;
  add(winner: WinnersStateItem): void;
  update(winner: WinnersStateItem): void;
  remove(id: number): void;
  getById(id: number): WinnersStateItem | undefined;
};

export const winnersState: WinnersStateType = {
  winners: {},
  totalCount: 0,

  set(winners: WinnersStateItem[], totalCount?: number) {
    this.winners = {};
    winners.forEach((w) => {
      this.winners[w.id] = w;
    });
    if (totalCount !== undefined) {
      this.totalCount = totalCount;
    }
  },

  add(winner: WinnersStateItem) {
    this.winners[winner.id] = winner;
    this.totalCount += 1;
  },

  update(winner: WinnersStateItem) {
    this.winners[winner.id] = winner;
  },

  remove(id: number) {
    this.winners = Object.fromEntries(
      Object.entries(this.winners).filter(([key]) => Number(key) !== id),
    );
    this.totalCount -= 1;
  },

  getById(id: number) {
    return this.winners[id];
  },
};
