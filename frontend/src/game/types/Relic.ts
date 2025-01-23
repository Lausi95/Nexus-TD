import { RELIC_TYPE } from '../enum/relic_type';
import { LEVEL_STATUS } from 'Models/enum/LEVEL_STATUS.ts';
import { AUGMENTS } from '../../lib/api/specs/api.ts';

export type Relic = {
  id: AUGMENTS;
  name: string;
  type: RELIC_TYPE;
  state: LEVEL_STATUS;
  max_uses: number;
  cooldown: number;
  cost: number;
  Icon: any;
};
