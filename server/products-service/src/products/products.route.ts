import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from 'zod-express-middleware';
import { createProductDto, updateProductDto } from './dto';
import { productsController } from './products.controller';

const router = Router();

router.get('/', productsController.getProducts);

router.get('/:productId', productsController.getProduct);

router.post(
  '/',
  validateRequest({ body: createProductDto }),
  productsController.createProduct
);

router.put(
  '/',
  validateRequest({ body: updateProductDto }),
  productsController.updateProduct
);

router.delete(
  '/:productId',
  validateRequest({ params: z.object({ categoryId: z.string().min(1) }) }),
  productsController.deleteProduct
);

export { router };
