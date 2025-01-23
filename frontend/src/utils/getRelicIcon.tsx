import DefaultIcon from '@mui/icons-material/Description';
import { Relic } from '../game/types/Relic.ts';
import { AUGMENTS } from '../lib/api/specs/api.ts';

export const getRelicIcon = (relic: Relic) => {
  if (relic.id === AUGMENTS.HEAL) return;
  else return <DefaultIcon />;
};
