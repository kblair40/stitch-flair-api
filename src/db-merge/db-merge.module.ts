import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { DbMerge } from './entities/db-merge.entity';
import { DbMergeService } from './db-merge.service';
import { DbMergeController } from './db-merge.controller';

export const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: 'localhost',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: 'stitchflair',
  synchronize: false,
};

export const prodConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: process.env.SUPABASE_HOST,
  username: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DB_NAME,
  synchronize: false,
};

const configToUse = process.env.NODE_ENV === 'dev' ? prodConfig : devConfig;
console.log('\n\nCONFIG TO USE:', configToUse, '\n\n');

@Module({
  // imports: [TypeOrmModule.forFeature([DbMerge])],
  imports: [
    TypeOrmModule.forRoot({
      ...configToUse,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([DbMerge]),
  ],
  controllers: [DbMergeController],
  providers: [DbMergeService],
})
export class DbMergeModule {}
