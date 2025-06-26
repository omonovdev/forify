import { Router } from 'express';
import { clientController } from '../controller/client.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { SelfGuard } from '../guards/self.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
const router = Router();
const controller = new clientController();

router.post('/', controller.createClient);
router.get('/', AuthGuard, RolesGuard(['admin', 'superadmin']), controller.getAllClients);
router.get('/:id', AuthGuard, SelfGuard, controller.getClientById);
router.patch('/:id', AuthGuard, SelfGuard, controller.updateClientById);
router.delete('/:id', AuthGuard, RolesGuard(['superadmin']), controller.deleteClientById);

export default router;
