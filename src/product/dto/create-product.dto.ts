export class CreateProductDto {
  name: string;
  price: number;
  description?: string;
  category: string;
  category_id: number;
  featured: boolean;
  on_sale: boolean;
  image_url: string;
}
