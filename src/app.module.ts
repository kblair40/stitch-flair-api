import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { PromotionModule } from './promotion/promotion.module';
import { TextModule } from './text/text.module';

console.log('\n\nprocess.env.PG_USER:', process.env.PG_USER);
console.log('process.env.PG_PASSWORD:', process.env.PG_PASSWORD);
const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: 'localhost',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: 'stitchflair',
  // synchronize: false,
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...pgConfig,
      autoLoadEntities: true,
    }),
    ProductModule,
    CategoryModule,
    PromotionModule,
    TextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
