import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import axios from 'axios';

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

      try {
        await axios.get(input.image_url);
      } catch (e) {
        console.log('\n\nINVALID IMAGE:', e);
        throw 'That does not appear to be a valid Image URL';
      }

      const prodCategory = await categoryRepo.findOne({
        where: { id: input.category_id },
        relations: { products: true },
      });

      const product = await this.productRepository.create({
        name: input.name || '',
        price: input.price,
        description: input.description || '',
        featured: input.featured,
        on_sale: input.on_sale,
        on_sale_price: input.on_sale_price,
        image_url: input.image_url || '',
        etsy_url: input.etsy_url,
        category_id: input.category_id,
        promos,
      });
      const savedProduct = await this.productRepository.save(product);
      console.log('\nSaved Product:', savedProduct, '\n');

      if (prodCategory?.products) {
        prodCategory.products.push(savedProduct);
        await categoryRepo.save(prodCategory);
      }

      return savedProduct;
    } catch (e) {
      console.log('\n\nE:', e);
      if (typeof e === 'string') {
        throw new HttpException(
          'That does not appear to be a valid Image URL',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e.detail?.includes('name')) {
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
    console.log('\nInput:', input, '\n');
    try {
      let foundProduct = await this.productRepository.findOne({
        where: { id },
        relations: { promos: true, category: true },
      });
      if (!foundProduct) {
        throw new HttpException('Could not find product', HttpStatus.NOT_FOUND);
      }

      const values: UpdateProductDto = { ...input };
      if (input.promo_ids) {
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
        console.log('Promo Update:', foundProduct);

        values.promos = promos;
      }
      const res = await this.productRepository.update(id, input);
      console.log('\nUpdate res:', res);
    } catch (e) {
      console.log('\nUpdate Failed:', e);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    console.log('Product ID to remove:', id);
    try {
      // const deleteRes = await this.productRepository.delete(id);
      await this.productRepository.delete(id);
      // console.log('DELETE RES:', deleteRes);
    } catch (e) {
      console.log('\nDelete Failed:', e);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

//
// Backup
// async create(input: CreateProductDto): Promise<Product> {
//   console.log('\nCreate Product Input:', input, '\n');
//   const categoryRepo = await this.dataSource.getRepository(Category);
//   const promoRepo = await this.dataSource.getRepository(Promotion);

//   try {
//     const promos = [];
//     if (input.promo_ids) {
//       for (const promoId of input.promo_ids) {
//         const promo = await promoRepo.findOne({ where: { id: promoId } });
//         console.log('\nFound Promo:', promo, '\n');
//         if (promo) promos.push(promo);
//       }
//       console.log('\nAll Promos:', promos);
//     }

//     try {
//       const imgRes = await axios.get(input.image_url);
//       console.log('IMG RES:', imgRes);
//     } catch (e) {
//       console.log('\n\nINVALID IMAGE:', e);
//       throw 'That does not appear to be a valid Image URL';
//     }

//     const prodCategory = await categoryRepo.findOne({
//       where: { id: input.category_id },
//       relations: { products: true },
//     });

//     const product = await this.productRepository.create({
//       name: input.name || '',
//       price: input.price,
//       // category_id: input.category_id,
//       description: input.description || '',
//       featured: input.featured,
//       on_sale: input.on_sale,
//       on_sale_price: input.on_sale_price,
//       image_url: input.image_url || '',
//       etsy_url: input.etsy_url,
//       category: prodCategory,
//       promos,
//     });
//     const savedProduct = await this.productRepository.save(product);
//     console.log('\nSaved Product:', savedProduct, '\n');

//     if (prodCategory?.products) {
//       prodCategory.products.push(savedProduct);
//       await categoryRepo.save(prodCategory);
//     }

//     return savedProduct;
//   } catch (e) {
//     // console.log('\n\nE:', e.detail);
//     if (typeof e === 'string') {
//       throw new HttpException(
//         'That does not appear to be a valid Image URL',
//         HttpStatus.BAD_REQUEST,
//       );
//     } else if (e.detail?.includes('name')) {
//       throw new HttpException(
//         'A product with that name already exists',
//         HttpStatus.BAD_REQUEST,
//       );
//     } else {
//       throw new HttpException(e.detail, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }
