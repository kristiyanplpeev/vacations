import { PositionsEnum } from '../common/constants';

export interface Teams {
  id: string;
  team: string;
  isDeleted: boolean;
}

export interface Positions {
  id: string;
  position: PositionsEnum;
}
