import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PositionsEnum } from '../common/constants';
import { Userdb } from './user.entity';
import { Positions } from '../users/interfaces';

@Entity({ name: 'positions' })
export class Positionsdb extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  position: PositionsEnum;

  @Column({ type: 'decimal' })
  coefficient: number;

  @Column({ type: 'smallint' })
  sort_order: number;

  @OneToMany(() => Userdb, (user) => user.position)
  user: Userdb[];

  toPositions(): Positions {
    return {
      id: this.id,
      position: this.position,
      coefficient: this.coefficient,
      sortOrder: this.sort_order,
    };
  }
}
