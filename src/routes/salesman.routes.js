import { Router } from 'express';
import { salesmanController } from '../controller/salesman.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { SelfGuard } from '../guards/self.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

const router = Router();
const controller = new salesmanController();
router.post('/', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.createSalesman);
router.get('/', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.getAllSalesmen);
router.get('/:id', AuthGuard, SelfGuard, controller.getSalesmanById);
router.patch('/:id', AuthGuard, SelfGuard, controller.updateSalesmanById);
router.delete('/:id', AuthGuard, RolesGuard(['superadmin']), controller.deleteSalesmanById);

export default router;
