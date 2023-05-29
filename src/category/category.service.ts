import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryService: Repository<Category>,
  ) {}

  async create(input: CreateCategoryDto) {
    console.log('Create Category Input:', input);
    const newCategory = await this.categoryService.create({
      title: input.title,
      products: [],
    });
    try {
      const savedCategory = await this.categoryService.save(newCategory);
      console.log('SAVED CATEGORY:', savedCategory);
      return savedCategory;
    } catch (e) {
      // console.log('detail', e.detail);
      // console.log('routine', e.routine);
      if (e.routine && e.routine.slice(-6) === 'unique') {
        throw new BadRequestException('Title must be unique');
      } else {
        throw new InternalServerErrorException('Failed to save category');
      }
    }
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
