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
      // const createPromises = categories.map((cat) => {
      //   return prodDataSource.manager.create(Category, cat);
      // });
      // const createdCategories = await Promise.all(createPromises);
      // const catRes = await prodDataSource.manager.save(createdCategories);
      // const catRes = await prodDataSource.manager.save(categories);
      // const catRes = await prodDataSource.manager.upsert(Category, categories, {
      //   // conflictPaths: [],
      //   conflictPaths: ['id', 'title'],
      //   skipUpdateIfNoValuesChanged: true,
      //   // What does 'primary-key' option for upsertType do?
      //   // upsertType: 'on-duplicate-key-update',
      //   // upsertType: 'primary-key',
      //   upsertType: 'on-conflict-do-update',
      // });
      // const catRes = await prodDataSource.manager.upsert(Category, categories, [
      //   'id',
      //   'title',
      // ]);

      // try {
      //   const catRes = await prodDataSource
      //     .createQueryBuilder()
      //     .insert()
      //     .into(Category)
      //     .values(categories)
      //     .orUpdate(['title'], ['id'], { skipUpdateIfNoValuesChanged: true })
      //     .execute();

      //   console.log('Cat Res:', catRes);
      // } catch (e) {
      //   console.log(`Failed insert:`, e);
      // }

      let i = 1;
      for (const category of categories) {
        try {
          const catRes = await prodDataSource
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values(category)
            .execute();

          console.log('cat res', `${i}:`, catRes);
        } catch (e) {
          console.log(`Failed insert ${i}:`, e);
        }
        i++;
      }

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
