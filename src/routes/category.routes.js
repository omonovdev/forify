import { Router } from 'express';
import { categoryController } from '../controller/category.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

const router = Router();
const controller = new categoryController();

router.post('/', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.createCategory);
router.get('/', AuthGuard, controller.getAllCategories);
router.get('/:id', AuthGuard, controller.getCategoryById);
router.patch('/:id', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.updateCategoryById)
router.delete('/:id', AuthGuard, RolesGuard(['superadmin']), controller.deleteCategoryById);

export default router;
