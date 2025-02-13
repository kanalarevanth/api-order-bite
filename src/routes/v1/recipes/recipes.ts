import { Router } from 'express';
// import { getAdminRecipes, addAdminRecipe, updateAdminRecipe, deleteAdminRecipe, validateAddRecipe, validateUpdateRecipe } from '../../../controllers/recipes/recipes';

const adminRecipes = Router();

// adminRecipes.get('/', (req, res) => res.handle(getAdminRecipes));
// adminRecipes.post('/', validateAddRecipe, (req, res) => res.handle(addAdminRecipe));
// adminRecipes.put('/', validateUpdateRecipe, (req, res) => res.handle(updateAdminRecipe));
// adminRecipes.delete('/', (req, res) => res.handle(deleteAdminRecipe));

export default adminRecipes;
