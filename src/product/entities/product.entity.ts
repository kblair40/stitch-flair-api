import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, type: 'money' })
  price?: number;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ nullable: true })
  etsy_url?: string;

  @Column({ default: false, nullable: true })
  featured?: boolean;

  @Column({ default: false, nullable: true })
  on_sale?: boolean;

  @Column({ nullable: true, type: 'money' })
  on_sale_price?: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
