import { AppDataSource } from '../config/database.js';
import { Category } from '../entities/Category.js';

export const categoryRepository = AppDataSource.getRepository(Category);
