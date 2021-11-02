import { Absencedb } from './absence.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Teamsdb } from './teams.entity';
import { Positionsdb } from './positions.entity';
import { User } from '../google/utils/interfaces';
import { RolesEnum } from '../common/constants';

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

  @Column({ type: 'varchar', length: 300, nullable: false, default: RolesEnum.user })
  role: RolesEnum;

  @ManyToOne(() => Teamsdb, (team) => team.user)
  team: Teamsdb;

  @ManyToOne(() => Positionsdb, (position) => position.user)
  position: Positionsdb;

  @OneToMany(() => Absencedb, (pto) => pto.employee)
  PTO: Absencedb[];

  toUser(): User {
    return {
      id: this.id,
      googleId: this.googleId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      picture: this.picture,
      role: this.role,
      team: this.team,
      position: this.position,
    };
  }
}
