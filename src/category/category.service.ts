import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindManyOptions } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

type FindOptions = FindManyOptions<Category>;

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryService: Repository<Category>,
  ) {}

  async create(input: CreateCategoryDto) {
    console.log('Create Category Input:', input);
    if (!input.title) {
      throw new HttpException('Title must be provided', HttpStatus.BAD_REQUEST);
    }

    const newCategory = await this.categoryService.create({
      title: input.title,
      products: [],
    });
    try {
      const savedCategory = await this.categoryService.save(newCategory);
      console.log('Saved Category:', savedCategory);
      return savedCategory;
    } catch (e) {
      if (e.routine && e.routine.slice(-6) === 'unique') {
        throw new HttpException('Title must be unique', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Failed to save category',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll() {
    const config: FindOptions = { relations: { products: true } };
    const allCategories = await this.categoryService.find(config);
    console.log('All Categories:', allCategories);
    return allCategories;
  }

  findOne(id: number) {
    return this.categoryService.findOneOrFail({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    try {
      const res = await this.categoryService.delete(id);
      console.log('remove res:', res);
      return res;
    } catch (e) {
      console.log('\nremove e:', e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
