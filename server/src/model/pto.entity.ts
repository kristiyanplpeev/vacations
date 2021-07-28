import { User } from './user.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'PTO' })
export class PTO extends BaseEntity {
  @Column({ type: 'date' })
  from_date: string;

  @Column({ type: 'date' })
  to_date: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @ManyToOne(() => User, (user) => user.PTO)
  employee: User;

  @ManyToMany(() => User)
  @JoinTable()
  approvers: User[];
}
