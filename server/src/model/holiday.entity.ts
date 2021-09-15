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
}
