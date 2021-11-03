import { PositionsEnum, TeamsEnum } from '../common/constants';

export interface Teams {
  id: string;
  team: TeamsEnum;
}

export interface Positions {
  id: string;
  position: PositionsEnum;
  coefficient: number;
  sortOrder: number;
}
