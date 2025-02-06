import express from 'express';
import { withAuth, withoutAuth } from '../../middleware/common';
import authRouter from './auth/auth';
import recipesRouter from './recipes/recipe';

const v1Router = express.Router({ mergeParams: true });

v1Router.use('/auth', withoutAuth(), authRouter);
v1Router.use('/recipe', recipesRouter);

export default v1Router;
