import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: 'localhost',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: 'stitchflair',
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...pgConfig,
      // entities: []
    }),
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
