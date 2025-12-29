import level1 from '../../../data/words/word-collection-level-1.json';
import level2 from '../../../data/words/word-collection-level-2.json';
import level3 from '../../../data/words/word-collection-level-3.json';
import level4 from '../../../data/words/word-collection-level-4.json';
import level5 from '../../../data/words/word-collection-level-5.json';
import level6 from '../../../data/words/word-collection-level-6.json';

import type { Game } from '../../../types/types';

export const levels: Game[] = [level1, level2, level3, level4, level5, level6];

const LEVEL_1_ROUNDS = 45;
const LEVEL_2_ROUNDS = 41;
const LEVEL_3_ROUNDS = 40;
const LEVEL_4_ROUNDS = 29;
const LEVEL_5_ROUNDS = 29;
const LEVEL_6_ROUNDS = 25;

export const levelRounds = [
  LEVEL_1_ROUNDS,
  LEVEL_2_ROUNDS,
  LEVEL_3_ROUNDS,
  LEVEL_4_ROUNDS,
  LEVEL_5_ROUNDS,
  LEVEL_6_ROUNDS,
];
