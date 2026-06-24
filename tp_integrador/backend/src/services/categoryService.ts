import { categoryRepository } from '../repositories/categoryRepository.js';

export async function getAllCategories() {
  const categories = await categoryRepository.find({
    order: { name: 'ASC' },
  });
  return categories;
}
