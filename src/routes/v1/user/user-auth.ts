import { Router } from 'express';
import { loginUser, logoutUser, validateAddUser, addUser } from '../../../controllers/user/user-auth';

const userAuthRouter = Router();

userAuthRouter.post('/login', (req, res) => res.handle(loginUser));
userAuthRouter.post('/logout', (req, res) => res.handle(logoutUser));
userAuthRouter.post('/signin', validateAddUser, (req, res) => res.handle(addUser));

export default userAuthRouter;
