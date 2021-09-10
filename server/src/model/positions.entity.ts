import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PositionsEnum } from '../common/constants';
import { User } from './user.entity';

@Entity({ name: 'positions' })
export class Positions extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  position: PositionsEnum;

  @OneToMany(() => User, (user) => user.position)
  user: User[];
}
