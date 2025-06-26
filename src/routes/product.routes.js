import { Router } from 'express';
import { productController } from '../controller/product.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

const router = Router();
const controller = new productController();
router.post('/', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.createProduct);
router.get('/', AuthGuard, controller.getAllProducts);
router.get('/:id', AuthGuard, controller.getProductById);
router.patch('/:id',AuthGuard,RolesGuard(['admin', 'superadmin']), controller.updateProductById);
router.delete('/:id',AuthGuard, RolesGuard(['admin', 'superadmin']), controller.deleteProductById);

export default router;
