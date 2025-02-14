import throwError from '../../helpers/error';
import { model, ObjectId } from 'mongoose';
import { MulterValidatorFn } from '../../helpers/multer';
import { APIOperation, createErrorResponseData, createSuccessResponseData } from '../../logging/application-log';
import { clone } from '../../helpers/common';
import { IAdminUser, IAdminUserModel } from '../../models/admin/admin-users';
import { IRestaurant, IRestaurantModel } from '../../models/admin/restaurants';
import { IRestaurantMenu, IRestaurantMenuModel } from '../../models/admin/menu';
import { RestaurantMenuActions } from '../../logging/actions/admin/admin-recipe';
const mongoose = require('mongoose');

const AdminUserModel = model('AdminUser') as IAdminUserModel;
const RestaurantModel = model('Restaurant') as IRestaurantModel;
const RestaurantMenuModel = model('RestaurantMenu') as IRestaurantMenuModel;
const ObjectId = mongoose.Types.ObjectId;

export const getAdminRecipes: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		const restaurantId = req.params.id;

		const dbQuery: any = {
			status: { $ne: 'deleted' },
			restaurant: new ObjectId(restaurantId),
		};

		const results = await RestaurantMenuModel.aggregate([
			{ $match: dbQuery },
			{
				$group: {
					_id: {
						category: '$category',
						type: '$type',
					},
					items: {
						$push: {
							name: '$name',
							description: '$description',
							price: '$price',
							image: '$image',
							availability: '$availability',
						},
					},
				},
			},
			{
				$group: {
					_id: '$_id.category',
					types: {
						$push: {
							type: '$_id.type',
							items: '$items',
						},
					},
				},
			},
			{
				$project: {
					category: '$_id',
					types: 1,
					_id: 0,
				},
			},
		]);

		operation.log(
			RestaurantMenuActions.get_recipes(req, {
				restaurantId: restaurantId,
				data: req.body,
				response: createSuccessResponseData(),
			}),
		);

		return results;
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			RestaurantMenuActions.get_recipes(req, {
				data: req.body,
				response: createErrorResponseData(errorCode, errorRes),
				meta: {
					error: {
						message: error.message,
						stack: error.stack,
					},
				},
			}),
		);
		throw error;
	}
};

export const validateAddRecipe: MulterValidatorFn = async (req, res, data, cb) => {
	if (!data || !data.name || !data.category || !data.price) {
		const errorCode = 400;
		const errorRes = res.createErrorResponse(errorCode);
		res.errorRes(errorCode);
		cb(false);
		return;
	}
	cb(true);
};

export const addAdminRecipe: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		let data = req.body;
		const restaurantId = req.params.id;
		const files = req.files;
		const session = req.session;

		data.price = parseInt(data.price);

		if (files?.length) {
			for (const file of files) {
				if (file.fieldname === 'image') {
					data.image = file.path;
				}
			}
		}

		const restaurant = await RestaurantModel.findById(restaurantId);

		if (!restaurant) {
			throwError(404);
		}

		data.restaurant = restaurant;

		const newMenuItem = new RestaurantMenuModel(data);
		await newMenuItem.save();

		const menuItems = [...restaurant.menu, newMenuItem._id];
		restaurant.menu = menuItems;
		await restaurant.save();

		operation.log(
			RestaurantMenuActions.add_recipe(req, {
				restaurantMenuId: newMenuItem._id.toString(),
				response: createSuccessResponseData(),
			}),
		);

		return newMenuItem;
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			RestaurantMenuActions.add_recipe(req, {
				data: req.body,
				response: createErrorResponseData(errorCode, errorRes),
				meta: {
					error: {
						message: error.message,
						stack: error.stack,
					},
				},
			}),
		);
		throw error;
	}
};
