import express from 'express';
import userAuthRouter from './auth/user-auth';
import adminAuthRouter from './auth/admin-auth';
import { withAuth, withoutAuth } from '../../middleware/common';
import adminRecipes from './recipes/recipes';

const v1Router = express.Router({ mergeParams: true });

v1Router.use('/user/auth', withoutAuth(), userAuthRouter);
v1Router.use('/admin/auth', withoutAuth(), adminAuthRouter);
v1Router.use('/admin/id/recipes', withAuth(), adminRecipes);

export default v1Router;
