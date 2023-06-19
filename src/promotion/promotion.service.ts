import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion) private promoRepository: Repository<Promotion>,
  ) {}

  async create(input: CreatePromotionDto) {
    const { text } = input;
    if (!text || typeof text !== 'string' || !text.trim().length) {
      throw new HttpException(
        'Text property cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const savedPromo = await this.promoRepository.save(input);
      console.log('\nSaved Promo:', savedPromo, '\n');
      return savedPromo;
    } catch (e) {
      console.log('Failed to save promotion:', e);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const allPromos = await this.promoRepository.find();
    console.log('\nallPromos:', allPromos, '\n');
    return allPromos;
  }

  async remove(id: number) {
    try {
      const deleteRes = await this.promoRepository.delete(id);
      console.log('\nDelete Res:', deleteRes);
    } catch (e) {
      console.log('Failed to delete product:', e);
      throw new HttpException(
        'Something went wrong:',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  update(id: number, updatePromotionDto: UpdatePromotionDto) {
    return `This action updates a #${id} promotion`;
  }
}
