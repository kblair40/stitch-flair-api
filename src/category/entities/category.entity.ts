import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  //   @OneToMany(() => Product, (product) => product.category_id)
  @Column()
  title: string;

  //   @Column()
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
