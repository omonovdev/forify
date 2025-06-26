import { Router } from 'express';
import { soldProductController } from '../controller/sold-product.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';


const router = Router();
const controller = new soldProductController();

router.post('/', AuthGuard, RolesGuard(['salesman', 'admin']), controller.createSold);
router.get('/', AuthGuard, RolesGuard(['salesman', 'admin']), controller.getAllSold);
router.get('/:id', AuthGuard, RolesGuard(['salesman', 'admin']), controller.getSoldById);
router.patch('/:id', AuthGuard, RolesGuard(['salesman', 'admin']), controller.updateSoldById);
router.delete('/:id', AuthGuard, RolesGuard(['salesman', 'admin']), controller.deleteSoldById);

export default router;
