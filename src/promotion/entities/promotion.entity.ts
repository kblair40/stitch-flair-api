import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  text: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({
    type: 'enum',
    default: 'green',
    enum: ['green', 'red', 'blue', 'orange', 'yellow', 'purple', 'peach'],
  })
  color: string;

  @CreateDateColumn()
  created_time: Date;

  @UpdateDateColumn()
  updated_time: Date;
}
