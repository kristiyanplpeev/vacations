import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeamsEnum } from '../common/constants';
import { User } from './user.entity';

@Entity({ name: 'teams' })
export class Teams extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  team: TeamsEnum;

  @OneToMany(() => User, (user) => user.team)
  user: User[];
}
