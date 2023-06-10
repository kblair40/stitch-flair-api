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
    if (!input.title) throw new BadRequestException('Title must be provided');
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
        throw new BadRequestException('Title must be unique');
      } else {
        throw new InternalServerErrorException('Failed to save category');
      }
    }
  }

  findAll() {
    return this.categoryService.find();
  }

  findOne(id: number) {
    return this.categoryService.findOneOrFail({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
