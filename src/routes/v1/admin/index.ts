import express from 'express';
import { withAuth, withoutAuth } from '../../../middleware/common';
import adminAuthRouter from './admin-auth';
import adminRecipes from './recipes';

const adminRouter = express.Router({ mergeParams: true });

adminRouter.use('/auth', adminAuthRouter);
adminRouter.use('/:id/recipes', withAuth(), adminRecipes);

export default adminRouter;
