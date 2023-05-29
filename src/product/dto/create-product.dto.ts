import { Category } from 'src/category/entities/category.entity';

export class CreateProductDto {
  name: string;
  price: number;
  description?: string;
  //   category: string;
  featured: boolean;
  on_sale: boolean;
  on_sale_price: number;
  image_url: string;
  category_id: number;
  category: Category;
}
