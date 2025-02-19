import { Router } from 'express';
import { loginUser, logoutUser, validateAddUser, addUser } from '../../../controllers/admin/admin-auth';

const adminAuthRouter = Router();

adminAuthRouter.post('/login', (req, res) => res.handle(loginUser));
adminAuthRouter.post('/logout', (req, res) => res.handle(logoutUser));
adminAuthRouter.post('/signin', validateAddUser, (req, res) => res.handle(addUser));

export default adminAuthRouter;
