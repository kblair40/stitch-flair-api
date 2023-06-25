import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, type: 'money' })
  price?: number;

  // @Column()
  // category_id: number;

  @Column({ nullable: true })
  image_url?: string;

  @Column()
  etsy_url: string;

  @Column({ default: false, nullable: true })
  featured?: boolean;

  @Column({ default: false, nullable: true })
  on_sale?: boolean;

  @Column({ nullable: true, type: 'money' })
  on_sale_price?: number;

  // https://typeorm.io/entities#special-columns
  @CreateDateColumn()
  created_time: Date;

  @UpdateDateColumn()
  updated_time: Date;

  @ManyToOne(() => Category, (category) => category.products, { cascade: true })
  category: Category;

  @ManyToMany(() => Promotion, { cascade: true })
  @JoinTable()
  promos: Promotion[];
}
