import { Promotion } from 'src/promotion/entities/promotion.entity';

export class UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  featured?: boolean;
  on_sale?: boolean;
  on_sale_price?: number;
  image_url?: string;
  category_id?: number;
  etsy_url?: string;
  promo_ids?: number[];
  promos?: Promotion[];
}
