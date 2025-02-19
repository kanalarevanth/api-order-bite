import express from 'express';
import userRouter from './user';
import adminRouter from './admin';
import { withoutAuth } from '../../middleware/common';

const v1Router = express.Router({ mergeParams: true });

v1Router.use('/user', withoutAuth(), userRouter);
v1Router.use('/admin', withoutAuth(), adminRouter);

export default v1Router;
