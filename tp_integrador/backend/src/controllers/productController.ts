import { Request, Response } from 'express';
import { z } from 'zod';
import { getProducts, getProductById, getAllBrands } from '../services/productService.js';

const listProductsSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price', 'name', 'rating']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function listProducts(req: Request, res: Response) {
  const parsed = listProductsSchema.safeParse(req.query);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    res.status(400).json({ message: 'Parámetros inválidos', errors });
    return;
  }

  try {
    const result = await getProducts(parsed.data);
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
}

export async function listBrands(_req: Request, res: Response) {
  try {
    const brands = await getAllBrands();
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Error al obtener las marcas' });
  }
}

export async function getProductDetail(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'ID inválido' });
    return;
  }

  try {
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
}
