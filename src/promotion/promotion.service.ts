import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion) private promoRepository: Repository<Promotion>,
    private dataSource: DataSource,
  ) {}

  async create(input: CreatePromotionDto) {
    const { text } = input;
    if (!text || typeof text !== 'string' || !text.trim().length) {
      throw new BadRequestException('Text property cannot be empty');
    }

    try {
      const savedPromo = await this.promoRepository.save(input);
      console.log('\nSaved Promo:', savedPromo, '\n');
      return savedPromo;
    } catch (e) {
      console.log('Failed to save promotion:', e);
      throw new InternalServerErrorException(JSON.stringify(e));
    }
  }

  async findAll() {
    const allPromos = await this.promoRepository.find();
    console.log('\nallPromos:', allPromos, '\n');
    return allPromos;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  update(id: number, updatePromotionDto: UpdatePromotionDto) {
    return `This action updates a #${id} promotion`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotion`;
  }
}
