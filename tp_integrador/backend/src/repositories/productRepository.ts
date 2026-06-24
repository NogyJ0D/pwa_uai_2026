import { AppDataSource } from '../config/database.js';
import { Product } from '../entities/Product.js';

export const productRepository = AppDataSource.getRepository(Product);
