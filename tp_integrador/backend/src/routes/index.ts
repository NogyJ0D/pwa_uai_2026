import { Router } from 'express';
import { listProducts, getProductDetail, listBrands } from '../controllers/productController.js';
import { getCategories } from '../controllers/categoryController.js';

const router = Router();

router.get('/productos', listProducts);
router.get('/productos/:id', getProductDetail);
router.get('/categorias', getCategories);
router.get('/marcas', listBrands);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default router;
