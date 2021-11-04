import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Userdb } from './user.entity';
import { Teams } from '../users/interfaces';

@Entity({ name: 'teams' })
export class Teamsdb extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  team: string;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @OneToMany(() => Userdb, (user) => user.team)
  user: Userdb[];

  toTeams(): Teams {
    return {
      id: this.id,
      team: this.team,
      isDeleted: this.is_deleted,
    };
  }
}
