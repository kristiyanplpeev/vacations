import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PositionsEnum } from '../common/constants';
import { Userdb } from './user.entity';
import { Positions } from '../users/interfaces';

@Entity({ name: 'positions' })
export class Positionsdb extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  position: PositionsEnum;

  @OneToMany(() => Userdb, (user) => user.position)
  user: Userdb[];

  toPositions(): Positions {
    return {
      id: this.id,
      position: this.position,
    };
  }
}
