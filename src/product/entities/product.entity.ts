import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Product {
  // might need autoincrementing type here...
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @Column()
  category_id: number;

  @Column()
  image_url: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: false })
  on_sale: boolean;

  @Column()
  on_sale_price: number;
}
