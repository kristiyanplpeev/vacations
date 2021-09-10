import { PTO } from './pto.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Teams } from './teams.entity';
import { Positions } from './positions.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  googleId: string;

  @Column({ type: 'varchar', length: 300 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  firstName: string;

  @Column({ type: 'varchar', length: 300 })
  lastName: string;

  @Column({ type: 'varchar', length: 300 })
  picture: string;

  @ManyToOne(() => Teams, (team) => team.user)
  team: Teams;

  @ManyToOne(() => Positions, (position) => position.user)
  position: Positions;

  @OneToMany(() => PTO, (pto) => pto.employee)
  PTO: PTO[];
}
