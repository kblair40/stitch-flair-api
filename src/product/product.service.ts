import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// export class CreateProductDto {
//   name: string;
//   price: number;
//   description?: string;
//   category: string;
//   category_id: number;
//   featured: boolean;
//   on_sale: boolean;
//   on_sale_price: number;
//   image_url: string;
// }

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(input: CreateProductDto): Promise<Product> {
    console.log('\nCreate Product Input:', input, '\n');
    const product = await this.productRepository.create({
      name: input.name || '',
      price: input.price,
      description: input.description || '',
      // category: input.category || '',
      featured: input.featured,
      on_sale: input.on_sale,
      on_sale_price: input.on_sale_price,
      image_url: input.image_url || '',
    });
    // const product = await this.productRepository.create({
    //   name: input.name || '',
    //   price: input.price,
    //   description: input.description || '',
    //   category: input.category || '',
    //   // category_id: input.category_id,

    // });
    const savedProduct = await this.productRepository.save(product);
    console.log('\nSaved Product:', savedProduct, '\n');
    return savedProduct;
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
