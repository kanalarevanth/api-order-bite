import { Router } from 'express';
import { multerValidation } from '../../../helpers/multer';
// import { getAdminRecipes, addAdminRecipe, updateAdminRecipe, deleteAdminRecipe, validateAddRecipe, validateUpdateRecipe } from '../../../controllers/recipes/recipes';

const adminRecipes = Router();

// adminRecipes.get('/', (req, res) => res.handle(getAdminRecipes));
// adminRecipes.post('/', multerValidation(validateAddRecipe), (req, res) => res.handle(addAdminRecipe));
// adminRecipes.put('/', multerValidation(validateUpdateRecipe), (req, res) => res.handle(updateAdminRecipe));
// adminRecipes.delete('/', (req, res) => res.handle(deleteAdminRecipe));

export default adminRecipes;
