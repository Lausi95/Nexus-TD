import { LocalLevels } from '../Models/data/LocalLevels.ts';

export const isChaosDungeon = (lvl: number) => {
  const foundChaosDungeon = LocalLevels.find((l) => l.level === lvl && l.chaosDungeon);
  return Boolean(foundChaosDungeon);
};
