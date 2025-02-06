import { Router } from 'express';
import { multerValidation } from '../../../helpers/multer';
import { addRecipe, validateAddRecipe } from '../../../controllers/recipe/recipe';

const recipesRouter = Router();

recipesRouter.post('/', multerValidation(validateAddRecipe), (req, res) => res.handle(addRecipe));

export default recipesRouter;
