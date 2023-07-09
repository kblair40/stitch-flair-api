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
// import { DbMergeModule } from './db-merge/db-merge.module';

const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: 'localhost',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: 'stitchflair',
  synchronize: false,
};

const prodConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  host: process.env.SUPABASE_HOST,
  username: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DB_NAME,
  synchronize: false,
};

const pgConfig: PostgresConnectionOptions =
  process.env.NODE_ENV === 'dev' ? devConfig : prodConfig;

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
    // DbMergeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
