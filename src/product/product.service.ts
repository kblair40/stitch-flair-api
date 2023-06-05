import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Category } from 'src/category/entities/category.entity';
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
    private dataSource: DataSource,
  ) {}

  async create(input: CreateProductDto): Promise<Product> {
    console.log('\nCreate Product Input:', input, '\n');

    const categoryRepo = await this.dataSource.getRepository(Category);

    const product = await this.productRepository.create({
      name: input.name || '',
      price: input.price,
      description: input.description || '',
      featured: input.featured,
      on_sale: input.on_sale,
      on_sale_price: input.on_sale_price,
      image_url: input.image_url || '',
      category_id: input.category_id,
    });

    const savedProduct = await this.productRepository.save(product);
    console.log('\nSaved Product:', savedProduct, '\n');

    const prodCategory = await categoryRepo.findOne({
      where: { id: input.category_id },
      relations: { products: true },
    });
    console.log('\nProd Category:', prodCategory);

    if (prodCategory?.products) {
      prodCategory.products.push(savedProduct);
      const savedCategory = await categoryRepo.save(prodCategory);
      console.log('\nSAVED CATEGORY:', savedCategory, '\n');
    }

    return savedProduct;
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    try {
      // const deleteRes = await this.productRepository.delete(id);
      await this.productRepository.delete(id);
      // console.log('DELETE RES:', deleteRes);
    } catch (e) {
      console.log('\nDelete Failed:', e);
    }
    return `This action removes a #${id} product`;
  }
}
