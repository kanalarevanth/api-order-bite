import { Router } from 'express';
import { loginUser, logoutUser, validateAddUser, addUser } from '../../../controllers/auth/auth';

const authRouter = Router();

authRouter.post('/login', (req, res) => res.handle(loginUser));
authRouter.post('/logout', (req, res) => res.handle(logoutUser));
authRouter.post('/signin', validateAddUser, (req, res) => res.handle(addUser));

export default authRouter;
