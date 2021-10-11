import { Holiday } from '../holidays/interfaces';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'holiday' })
export class Holidaydb extends BaseEntity {
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'boolean' })
  movable: boolean;

  @Column({ type: 'varchar', length: 300 })
  comment: string;

  toHoliday(): Holiday {
    return {
      id: this.id,
      date: new Date(this.date),
      movable: this.movable,
      comment: this.comment,
    };
  }
}
