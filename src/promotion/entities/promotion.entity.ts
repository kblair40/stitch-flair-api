import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToMany,
} from 'typeorm';
// import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({
    type: 'enum',
    default: 'green',
    enum: ['green', 'red', 'blue', 'orange', 'purple', 'peach'],
  })
  color: string;

  // @ManyToMany(() => Product, (product) => product.promos)
  // products: Product[];

  @CreateDateColumn()
  created_time: Date;

  @UpdateDateColumn()
  updated_time: Date;
}
