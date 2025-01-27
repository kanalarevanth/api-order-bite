import express from 'express';
import authRouter from './auth/auth';
import { withAuth, withoutAuth } from '../../middleware/common';

const v1Router = express.Router({ mergeParams: true });

v1Router.use('/auth', withoutAuth(), authRouter);

export default v1Router;
