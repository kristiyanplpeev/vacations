import { Userdb } from './user.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PTOStatus } from '../common/constants';
import { PTO } from '../holidays/interfaces';

@Entity({ name: 'PTO' })
export class PTOdb extends BaseEntity {
  @Column({ type: 'date' })
  from_date: string;

  @Column({ type: 'date' })
  to_date: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'varchar', length: 30 })
  status: PTOStatus;

  @ManyToOne(() => Userdb, (user) => user.PTO)
  employee: Userdb;

  @ManyToMany(() => Userdb)
  @JoinTable()
  approvers: Array<Userdb>;

  toPTO(): PTO {
    return {
      id: this.id,
      from_date: this.from_date,
      to_date: this.to_date,
      comment: this.comment,
      status: this.status,
      employee: this.employee,
      approvers: this.approvers,
    };
  }
}
