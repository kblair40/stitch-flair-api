import { PartialType } from '@nestjs/mapped-types';
import { CreateDbMergeDto } from './create-db-merge.dto';

export class UpdateDbMergeDto extends PartialType(CreateDbMergeDto) {}
