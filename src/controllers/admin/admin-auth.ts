import throwError from '../../helpers/error';
import { createHash, verifyHash } from '../../helpers/hash';
import { getSessionById, setSessionById, destorySessionById } from '../../middleware/session/store';
import { prepareAdminSessionData } from '../../helpers/auth';
import { model } from 'mongoose';
import { AdminAuthActions } from '../../logging/actions/admin/admin-auth';
import { APIOperation, createErrorResponseData, createSuccessResponseData } from '../../logging/application-log';
import { clone } from '../../helpers/common';
import { IAdminUser, IAdminUserModel } from '../../models/admin/admin-users';
import { IRestaurant, IRestaurantModel } from '../../models/admin/restaurants';

const AdminUserModel = model('AdminUser') as IAdminUserModel;
const RestaurantModel = model('Restaurant') as IRestaurantModel;

export const loginUser: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		const data = req.body;
		const currentSessionID = req.sessionID;
		const currentSession = req.session;

		if (!data.email || !data.password) {
			throwError(400);
		}
		const user = await AdminUserModel.findOne({
			status: 'active',
			email: data.email,
		})
			.populate({ path: 'restaurant' })
			.collation({ locale: 'en_US', numericOrdering: false });

		if (!user) {
			throwError(404);
		}

		if (!verifyHash(data.password, user.password)) {
			throwError(401);
		}

		const sessions = [];
		const sessionData = await prepareAdminSessionData(user);
		for (const ses of user.sessions) {
			const sessionDetails = await getSessionById(ses);
			if (sessionDetails) {
				sessions.push(ses);
			}
		}

		if (!sessions.find((s) => s === currentSessionID)) {
			sessions.push(currentSessionID);
			currentSession.user = sessionData;
			await setSessionById(currentSessionID, sessionData);
			const sessionDetailss = await getSessionById(currentSessionID);
		}

		user.sessions = sessions;

		await user.save({ timestamps: false });

		operation.log(
			AdminAuthActions.login_user(req, {
				userId: sessionData._id,
				by: sessionData._id,
				response: createSuccessResponseData(),
			}),
		);

		return {
			user: sessionData,
			token: currentSessionID,
		};
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			AdminAuthActions.login_user(req, {
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

export const logoutUser: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		const session = req.session;
		const sessionID = req.sessionID;

		const user = await AdminUserModel.findByIdAndUpdate(
			session?.user?._id,
			{
				$pull: {
					sessions: sessionID,
				},
			},
			{ timestamps: false, new: true },
		);

		if (!user) {
			throwError(404);
		}

		await destorySessionById(sessionID);

		session.destroy();

		operation.log(
			AdminAuthActions.logout_user(req, {
				userId: user?._id?.toString(),
				response: createSuccessResponseData(),
			}),
		);

		return {};
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			AdminAuthActions.logout_user(req, {
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

export const validateAddUser = async (req, res, data, cb) => {
	const operation = new APIOperation();

	if (!data || !data?.userData || !data?.restaurantData || !data.userData.firstName || !data.userData.email || !data.userData.password || !data?.restaurantData.name) {
		const errorCode = 400;
		const errorRes = res.createErrorResponse(errorCode);

		operation.errorLog(
			AdminAuthActions.add_user(req, {
				data: data,
				response: createErrorResponseData(errorCode, errorRes),
			}),
		);
		res.errorRes(errorCode);
		cb(false);
		return;
	} else {
		const existingUser = await AdminUserModel.findOne({
			email: data.email,
			status: { $ne: 'deleted' },
		})
			.lean()
			.collation({ locale: 'en_US', numericOrdering: false });

		if (existingUser) {
			const errorCode = 409;
			const errorRes = res.createErrorResponse(errorCode);
			operation.errorLog(
				AdminAuthActions.add_user(req, {
					data: data,
					response: createErrorResponseData(errorCode, errorRes),
				}),
			);
			res.errorRes(errorCode);
			cb(false);
			return;
		}
		cb(true);
		return;
	}
};

export const addUser: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		const data: any = req.body;
		const files = req.files;

		let userData: IAdminUser = clone(data.userData);
		const restaurantData: IRestaurant = clone(data.restaurantData);

		if (files?.length) {
			for (const file of files) {
				if (file.fieldname === 'avatar') {
					userData.avatar = file.location;
				}
				if (file.fieldname === 'thumb') {
					userData.thumb = file.location;
				}
			}
		}

		RestaurantModel.deletePrivateProps(restaurantData);

		const newUserRestaurant = new RestaurantModel(restaurantData);
		await newUserRestaurant.save();

		userData.password = createHash(userData.password);
		userData.restaurant = newUserRestaurant?._id;

		const newUser = new AdminUserModel(userData);
		await newUser.save();

		operation.log(
			AdminAuthActions.add_user(req, {
				userId: newUser._id?.toString(),
				response: createSuccessResponseData(),
			}),
		);

		return {};
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			AdminAuthActions.add_user(req, {
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
