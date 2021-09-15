import { PTOdb } from './pto.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Teamsdb } from './teams.entity';
import { Positionsdb } from './positions.entity';
import { User } from '../google/utils/interfaces';

@Entity({ name: 'user' })
export class Userdb extends BaseEntity {
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

  @ManyToOne(() => Teamsdb, (team) => team.user)
  team: Teamsdb;

  @ManyToOne(() => Positionsdb, (position) => position.user)
  position: Positionsdb;

  @OneToMany(() => PTOdb, (pto) => pto.employee)
  PTO: PTOdb[];

  toUser(): User {
    return {
      id: this.id,
      googleId: this.googleId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      picture: this.picture,
      team: this.team,
      position: this.position,
    };
  }
}
