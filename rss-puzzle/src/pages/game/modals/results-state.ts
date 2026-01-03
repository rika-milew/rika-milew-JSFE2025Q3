import type { RoundResults, SentenceResults } from '../../../types/types';

let results: RoundResults | undefined;

export const resultsState = {
  initRound(data: Omit<RoundResults, 'sentences'>): void {
    results = {
      ...data,
      sentences: [],
    };
  },

  addSentence(stat: SentenceResults): void {
    results?.sentences.push(stat);
  },

  get(): RoundResults | undefined {
    return results;
  },

  reset(): void {
    results = undefined;
  },
};
