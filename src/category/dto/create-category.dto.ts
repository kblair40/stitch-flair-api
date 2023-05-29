import { Product } from 'src/product/entities/product.entity';

export class CreateCategoryDto {
  id: number;
  title: string;
  products: Product[];
}
