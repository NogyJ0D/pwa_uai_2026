import { Request, Response } from 'express';
import { getAllCategories } from '../services/categoryService.js';

export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
}
