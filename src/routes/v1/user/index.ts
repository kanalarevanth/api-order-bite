import express from 'express';
import { withAuth, withoutAuth } from '../../../middleware/common';
import userAuthRouter from './user-auth';

const userRouter = express.Router({ mergeParams: true });

userRouter.use('/auth', userAuthRouter);

export default userRouter;
