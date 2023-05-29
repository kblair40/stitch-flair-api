import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ProductModule } from './product/product.module';

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
      autoLoadEntities: true,
    }),
    ProductModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
