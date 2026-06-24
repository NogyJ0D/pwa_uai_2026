import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from '../entities/Product.js';
import { Category } from '../entities/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const { DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_TYPE || !DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Faltan variables de entorno para la base de datos. Verifique .env');
}

export const AppDataSource = new DataSource({
  type: DB_TYPE as 'mysql' | 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Product, Category],
  synchronize: false,
  logging: false,
});
