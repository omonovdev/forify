import { Router } from 'express';

import { adminController } from '../controller/admin.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { SelfGuard } from '../guards/self.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

const router = Router();
const controller = new adminController();

router
    .post('/', AuthGuard, RolesGuard(['superadmin']), controller.createAdmin)
    .post('/signin', controller.signIn)
    .post('/verify-otp', controller.verifyOtp) 
    .post('/token', controller.newAccessToken)
    .post('/logout', AuthGuard, controller.logOut)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAlladmins)
    .get('/:id', AuthGuard, SelfGuard, controller.getByIDAdmin)
    .patch('/:id', AuthGuard, SelfGuard, controller.UpdateById)
    .delete('/:id', AuthGuard, SelfGuard, controller.deleteById)

export default router;
