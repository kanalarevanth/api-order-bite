import { IApplicationLog, ResponseData } from '../../type';
import { Module } from '../../modules';
import { Request } from 'express';
import { getAPIDetails } from '../../application-log';
import { RestaurantMenuModel } from '../../../models/admin/menu';

export const RestaurantMenuActions = {
	add_recipe: (
		request: Request,
		info: Partial<{
			restaurantMenuId: string;
			data: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'recipes',
			actionType: 'add',
			action: 'add_recipe',
			severity: 3,
			message: 'Add Recipe',
			by: request.session.user?._id || null,
			data: info.data,
			entity: RestaurantMenuModel.collection.collectionName,
			entityId: info.restaurantMenuId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	get_recipes: (
		request: Request,
		info: Partial<{
			restaurantId: string;
			data: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'recipes',
			actionType: 'read',
			action: 'get_recipes',
			severity: 2,
			message: 'Get Recipes',
			by: request.session.user?._id || null,
			data: info.data,
			entity: RestaurantMenuModel.collection.collectionName,
			entityId: info.restaurantId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	get_recipe: (
		request: Request,
		info: Partial<{
			restaurantMenuId: string;
			data: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'recipes',
			actionType: 'read',
			action: 'get_recipe',
			severity: 2,
			message: 'Get Recipe',
			by: request.session.user?._id || null,
			data: info.data,
			entity: RestaurantMenuModel.collection.collectionName,
			entityId: info.restaurantMenuId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	update_recipe: (
		request: Request,
		info: Partial<{
			restaurantMenuId: string;
			data: any;
			updatedData: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'recipes',
			actionType: 'update',
			action: 'update_recipe',
			severity: 8,
			message: 'Update Recipe',
			by: request.session.user?._id || null,
			data: info.data,
			updatedData: info.updatedData,
			entity: RestaurantMenuModel.collection.collectionName,
			entityId: info.restaurantMenuId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	delete_recipe: (
		request: Request,
		info: Partial<{
			restaurantMenuId: string;
			data: any;
			updatedData: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'recipes',
			actionType: 'delete',
			action: 'delete_recipe',
			severity: 10,
			message: 'Delete Recipe',
			by: request.session.user?._id || null,
			data: info.data,
			updatedData: info.updatedData,
			entity: RestaurantMenuModel.collection.collectionName,
			entityId: info.restaurantMenuId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
} as const;
