import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Text } from './entities/text.entity';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';

@Injectable()
export class TextService {
  constructor(
    @InjectRepository(Text) private textRepository: Repository<Text>,
  ) {}

  async create(input: CreateTextDto) {
    console.log('\n\nINPUT:', input, '\n\n');

    try {
      const createdText = await this.textRepository.create(input);
      const savedText = await this.textRepository.save(createdText);
      console.log('\nSaved Text:', savedText);
      return savedText;
    } catch (e) {
      console.log('\nFailed to create text:', e);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    let text: Text[] | Text = await this.textRepository.find();
    console.log('\nRaw Text:', text);
    if (text && Array.isArray(text)) {
      text = text[0];
      console.log('Returning Text:', text, '\n');
      return text;
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException('Something went wrong', status);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} text`;
  }

  update(id: number, updateTextDto: UpdateTextDto) {
    return this.textRepository.update({ id }, updateTextDto);
  }

  remove(id: number) {
    return `This action removes a #${id} text`;
  }
}
