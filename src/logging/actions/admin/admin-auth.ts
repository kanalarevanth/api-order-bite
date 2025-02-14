import { IApplicationLog, ResponseData } from '../../type';
import { Module } from '../../modules';
import { Request } from 'express';
import { getAPIDetails } from '../../application-log';
import { AdminUserModel } from '../../../models/admin/admin-users';

export const AdminAuthActions = {
	renew_user: (
		request: Request,
		info: Partial<{
			userId: string;
			by: string;
			data: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'auth',
			actionType: 'other',
			action: 'renew_user',
			severity: 6,
			message: 'User Renew',
			by: info.by,
			userId: request?.session?.user?._id || null,
			data: info.data,
			entity: AdminUserModel.collection.collectionName,
			entityId: info.userId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	add_user: (
		request: Request,
		info: Partial<{
			userId: string;
			data: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'auth',
			actionType: 'add',
			action: 'add_user',
			severity: 3,
			message: 'Add User',
			by: request.session.user?._id || null,
			data: info.data,
			entity: AdminUserModel.collection.collectionName,
			entityId: info.userId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	login_user: (
		request: Request,
		info: Partial<{
			userId: string;
			by: string;
			data: any;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'auth',
			actionType: 'other',
			action: 'login_user',
			severity: 6,
			message: 'User Login',
			by: info.by,
			userId: request?.session?.user?._id || null,
			data: info.data,
			entity: AdminUserModel.collection.collectionName,
			entityId: info.userId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
	logout_user: (
		request: Request,
		info: Partial<{
			userId: string;
			response: ResponseData;
			meta: any;
		}>,
	): IApplicationLog & Module<'admin_management'> => {
		return {
			type: 'info',
			module: 'admin_management',
			feature: 'auth',
			actionType: 'other',
			action: 'logout_user',
			severity: 6,
			message: 'User Logout',
			by: request.session.user?._id || null,
			userId: request?.session?.user?._id || null,
			entity: AdminUserModel.collection.collectionName,
			entityId: info.userId,
			api: getAPIDetails(request, info.response, Object.assign(info.meta || {}, { query: request.query })),
		};
	},
} as const;
