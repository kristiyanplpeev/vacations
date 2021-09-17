import { Userdb } from './user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PTO } from '../holidays/interfaces';

@Entity({ name: 'PTO' })
export class PTOdb extends BaseEntity {
  @Column({ type: 'date' })
  from_date: string;

  @Column({ type: 'date' })
  to_date: string;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => Userdb, (user) => user.PTO)
  employee: Userdb;

  toPTO(): PTO {
    return {
      id: this.id,
      from_date: this.from_date,
      to_date: this.to_date,
      comment: this.comment,
      employee: this.employee,
    };
  }
}
