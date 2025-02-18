import express from 'express';
import { multerValidation } from '../../../helpers/multer';
import { getAdminRecipes, getAdminRecipe, addAdminRecipe, validateAddRecipe, validateUpdateRecipe, updateAdminRecipe } from '../../../controllers/admin/recipes';

const adminRecipes = express.Router({ mergeParams: true });

adminRecipes.get('/', (req, res) => res.handle(getAdminRecipes));
adminRecipes.get('/:recipeId', (req, res) => res.handle(getAdminRecipe));
adminRecipes.post('/', multerValidation(validateAddRecipe), (req, res) => res.handle(addAdminRecipe));
adminRecipes.put('/:recipeId', multerValidation(validateUpdateRecipe), (req, res) => res.handle(updateAdminRecipe));
// adminRecipes.delete('/', (req, res) => res.handle(deleteAdminRecipe));

export default adminRecipes;
