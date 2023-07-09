import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { Text } from 'src/text/entities/text.entity';
import { DbMerge } from './entities/db-merge.entity';

const prodConfig: PostgresConnectionOptions = {
  type: 'postgres',
  name: 'prodConn',
  port: 5432,
  host: process.env.SUPABASE_HOST,
  username: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DB_NAME,
  synchronize: false,
  entities: [Product, Category, Promotion, Text],
};
const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  name: 'devConn',
  port: 5432,
  host: 'localhost',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: 'stitchflair',
  synchronize: false,
  entities: [Product, Category, Promotion, Text],
};

const prodDataSource = new DataSource(prodConfig);
const devDataSource = new DataSource(devConfig);

@Injectable()
export class DbMergeService {
  constructor(
    @InjectRepository(DbMerge) private productRepository: Repository<DbMerge>, // private dataSource: DataSource,
  ) {}

  async mergeTable(table: string) {
    console.log('\nMERGE TABLES:', table);
    // console.log('\nData Source:', prodDataSource);
    // console.log('PROD Keys:', Object.keys(prodDataSource));
    console.log('isInitialized:', {
      prod: prodDataSource.isInitialized,
      dev: devDataSource.isInitialized,
    });

    if (!prodDataSource.isInitialized || !devDataSource.isInitialized) {
      const promises = [];
      if (!prodDataSource.isInitialized) {
        promises.push(prodDataSource.initialize());
      }
      if (!devDataSource.isInitialized) {
        promises.push(devDataSource.initialize());
      }

      try {
        await Promise.all(promises);
        console.log('Connecting to:', promises);
      } catch (e) {
        console.log('Failed to initialize db connection:', e);
        return;
      }
    }

    // const devConn = await devDataSource.initialize();
    // const prodConn = await prodDataSource.initialize();

    // console.log('Conns:', { devConn, prodConn });

    // console.log('PROD Keys:', Object.keys(prodDataSource));
    // console.log('PROD metadataTableName:', prodDataSource.metadataTableName);
    // console.log('PROD manager:', prodDataSource.manager);

    // console.log('\n\n\nDEV Keys:', Object.keys(devDataSource));
    // console.log('DEV metadataTableName:', devDataSource.metadataTableName);
    // console.log('DEV manager:', devDataSource.manager);

    let products, categories, promotions, text;
    try {
      [products, categories, promotions, text] = await Promise.all([
        devDataSource.manager.query('select * from product'),
        devDataSource.manager.query('select * from category'),
        devDataSource.manager.query('select * from promotion'),
        devDataSource.manager.query('select * from text'),
        // devDataSource.manager.find(Product),
        // devDataSource.manager.find(Category),
        // devDataSource.manager.find(Promotion),
        // devDataSource.manager.find(Text),
      ]);
    } catch (e) {
      console.log('\n\nFAILED FINDING ENTITIES:', e);
      return;
    }
    // console.log('Results:', { products, categories, promotions, text });

    try {
      const catRes = await prodDataSource.manager.save(categories);
      // const catRes = await prodDataSource.manager.upsert(Category, categories, {
      //   // conflictPaths: [],
      //   conflictPaths: ['id', 'title'],
      //   skipUpdateIfNoValuesChanged: true,
      //   indexPredicate: '',
      // });
      // const catRes = await prodDataSource.manager.upsert(Category, categories, [
      //   'id',
      //   'title',
      // ]);
      console.log('cat res:', catRes);

      // for (const category of categories) {
      //   await prodDataSource.manager.upsert(category);
      // }
      // const allProducts = this.productRepository.find();
    } catch (e) {
      console.log('\n\nFAILED UPSERTING ENTITIES:', e);
    }

    return 'This action adds a new dbMerge';
  }

  // findAll() {
  //   return `This action returns all dbMerge`;
  // }
}
