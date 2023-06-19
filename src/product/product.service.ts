import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  type HttpExceptionOptions,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
// import type { FindManyOptions, FindOneOptions } from 'typeorm';

import { Category } from 'src/category/entities/category.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(input: CreateProductDto): Promise<Product> {
    console.log('\nCreate Product Input:', input, '\n');
    const categoryRepo = await this.dataSource.getRepository(Category);
    const promoRepo = await this.dataSource.getRepository(Promotion);

    try {
      const promos = [];
      if (input.promo_ids) {
        for (const promoId of input.promo_ids) {
          const promo = await promoRepo.findOne({ where: { id: promoId } });
          console.log('\nFound Promo:', promo, '\n');
          if (promo) promos.push(promo);
        }
        console.log('\nAll Promos:', promos);
      }

      const product = await this.productRepository.create({
        name: input.name || '',
        price: input.price,
        category_id: input.category_id,
        description: input.description || '',
        featured: input.featured,
        on_sale: input.on_sale,
        on_sale_price: input.on_sale_price,
        image_url: input.image_url || '',
        etsy_url: input.etsy_url,
        promos,
      });
      const savedProduct = await this.productRepository.save(product);
      console.log('\nSaved Product:', savedProduct, '\n');

      const prodCategory = await categoryRepo.findOne({
        where: { id: input.category_id },
        relations: { products: true },
      });

      if (prodCategory?.products) {
        prodCategory.products.push(savedProduct);
        await categoryRepo.save(prodCategory);
      }

      return savedProduct;
    } catch (e) {
      console.log('\n\nE:', e.detail);
      if (e.detail.includes('name')) {
        throw new HttpException(
          'A product with that name already exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(e.detail, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  findAll() {
    return this.productRepository.find({
      order: { created_time: 'ASC' },
      relations: { promos: true, category: true },
    });
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  async updateProduct(id: number, input: UpdateProductDto) {
    console.log('\nINPUT:', input, '\n');
    try {
      let foundProduct = await this.productRepository.findOne({
        where: { id },
        relations: { promos: true, category: true },
      });
      if (!foundProduct) {
        return new InternalServerErrorException('Could not find product');
      }

      const promos = [];
      if (input.promo_ids) {
        for (const promoId of input.promo_ids) {
          const promoRepo = await this.dataSource.getRepository(Promotion);
          const promo = await promoRepo.findOne({ where: { id: promoId } });
          console.log('\nFound Promo:', promo, '\n');
          if (promo) promos.push(promo);
        }
        console.log('\nAll Promos:', promos);
      }

      const values: any = { ...input }; // todo: improve 'any'
      if (input.promo_ids) {
        // delete input.promo_ids; // remove promo_ids, so promos can be saved in it's place
        const promoRepo = await this.dataSource.getRepository(Promotion);
        const promos = [];
        for (const promoId of input.promo_ids) {
          const promo = await promoRepo.findOne({ where: { id: promoId } });
          console.log('\nFound Promo:', promo, '\n');
          if (promo) promos.push(promo);
        }
        delete input.promo_ids; // remove promo_ids, so promos can be saved in it's place
        foundProduct.promos = promos;
        foundProduct = await this.productRepository.save(foundProduct);
        console.log('PROMO UPDATE:', foundProduct);

        values.promos = promos;
      }
      const res = await this.productRepository.update(id, input);
      console.log('\nUpdate res:', res);
    } catch (e) {
      console.log('\nUpdate Failed:', e);
      return new InternalServerErrorException(JSON.stringify(e));
    }
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

//
// Backup
// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product) private productRepository: Repository<Product>,
//     private dataSource: DataSource,
//   ) {}

//   async create(input: CreateProductDto): Promise<Product> {
//     console.log('\nCreate Product Input:', input, '\n');

//     const categoryRepo = await this.dataSource.getRepository(Category);

//     const product = await this.productRepository.create({
//       name: input.name || '',
//       price: input.price,
//       description: input.description || '',
//       featured: input.featured,
//       on_sale: input.on_sale,
//       on_sale_price: input.on_sale_price,
//       image_url: input.image_url || '',
//       category_id: input.category_id,
//     });

//     const savedProduct = await this.productRepository.save(product);
//     console.log('\nSaved Product:', savedProduct, '\n');

//     const prodCategory = await categoryRepo.findOne({
//       where: { id: input.category_id },
//       relations: { products: true },
//     });
//     console.log('\nProd Category:', prodCategory);

//     if (prodCategory?.products) {
//       prodCategory.products.push(savedProduct);
//       const savedCategory = await categoryRepo.save(prodCategory);
//       console.log('\nSAVED CATEGORY:', savedCategory, '\n');
//     }

//     return savedProduct;
//   }

//   findAll() {
//     return this.productRepository.find();
//   }

//   findOne(id: number) {
//     return this.productRepository.findOne({ where: { id } });
//   }

//   update(id: number, updateProductDto: UpdateProductDto) {
//     return `This action updates a #${id} product`;
//   }

//   async remove(id: number) {
//     try {
//       // const deleteRes = await this.productRepository.delete(id);
//       await this.productRepository.delete(id);
//       // console.log('DELETE RES:', deleteRes);
//     } catch (e) {
//       console.log('\nDelete Failed:', e);
//     }
//     return `This action removes a #${id} product`;
//   }
// }
