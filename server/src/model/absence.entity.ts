import { Userdb } from './user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PTO } from '../holidays/interfaces';
import { AbsenceTypesEnum } from '../common/constants';

@Entity({ name: 'absence' })
export class Absencedb extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  type: AbsenceTypesEnum;

  @Column({ type: 'date' })
  from_date: string;

  @Column({ type: 'date' })
  to_date: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @ManyToOne(() => Userdb, (user) => user.PTO)
  employee: Userdb;

  toPTO(): PTO {
    return {
      id: this.id,
      type: this.type,
      from_date: new Date(this.from_date),
      to_date: new Date(this.to_date),
      comment: this.comment,
      employee: this.employee,
    };
  }
}
