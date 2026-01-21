import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import knex, { Knex } from 'knex';
@Injectable()
export class KnexService implements OnModuleDestroy, OnModuleInit {
  public knexInstance: Knex;
  
  async onModuleInit() {
    this.knexInstance = knex({
      client: 'pg',
      connection: {
        port: Number(process.env.DB_PORT),
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
      },
    });

    // Test the connection
    await this.knexInstance.raw('SELECT 1+1 AS result');
    console.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.knexInstance.destroy();
    console.log('Database connection closed');
  }
}
