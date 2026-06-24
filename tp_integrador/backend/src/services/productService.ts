import { productRepository } from '../repositories/productRepository.js';

const ALLOWED_SORT_FIELDS = ['price', 'name', 'rating'] as const;
const SORT_FIELD_MAP: Record<string, string> = {
  price: 'product.price',
  name: 'product.name',
  rating: 'product.rating',
};

interface GetProductsParams {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getProducts(params: GetProductsParams) {
  const { category, brand, priceMin, priceMax, sortBy = 'price', order = 'asc', page = 1, limit = 10 } = params;

  const query = productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .skip((page - 1) * limit)
    .take(limit);

  if (category) {
    query.andWhere('category.name = :category', { category });
  }

  if (brand) {
    query.andWhere('product.brand = :brand', { brand });
  }

  if (priceMin !== undefined) {
    query.andWhere('product.price >= :priceMin', { priceMin });
  }

  if (priceMax !== undefined) {
    query.andWhere('product.price <= :priceMax', { priceMax });
  }

  const sortColumn = ALLOWED_SORT_FIELDS.includes(sortBy as any) ? SORT_FIELD_MAP[sortBy] : SORT_FIELD_MAP.price;
  query.orderBy(sortColumn, order === 'desc' ? 'DESC' : 'ASC');

  const [products, total] = await query.getManyAndCount();

  return { products, total, page, limit };
}

export async function getAllBrands() {
  const brands = await productRepository
    .createQueryBuilder('product')
    .select('DISTINCT product.brand', 'brand')
    .where('product.brand IS NOT NULL')
    .andWhere("product.brand != ''")
    .orderBy('product.brand', 'ASC')
    .getRawMany();

  return brands.map(b => b.brand);
}

export async function getProductById(id: number) {
  const product = await productRepository.findOne({
    where: { id },
    relations: ['category'],
  });

  return product;
}
