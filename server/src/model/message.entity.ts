import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'message' })
export class Message extends BaseEntity {
  @Column({ type: 'varchar', length: 300 })
  name: string;
}
