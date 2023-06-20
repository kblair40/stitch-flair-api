import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Text } from './entities/text.entity';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';

@Injectable()
export class TextService {
  constructor(@InjectRepository(Text) private textService: Repository<Text>) {}

  async create(input: CreateTextDto) {
    console.log('\n\nINPUT:', input, '\n\n');

    try {
      const createRes = await this.textService.create(input);
      console.log('\nCreate Res:', createRes);
      return createRes;
    } catch (e) {
      console.log('\nFailed to create text:', e);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all text`;
  }

  findOne(id: number) {
    return `This action returns a #${id} text`;
  }

  update(id: number, updateTextDto: UpdateTextDto) {
    return `This action updates a #${id} text`;
  }

  remove(id: number) {
    return `This action removes a #${id} text`;
  }
}
