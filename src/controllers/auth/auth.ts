import throwError from '../../helpers/error';
import { createHash, verifyHash } from '../../helpers/hash';
import { getSessionById, setSessionById, destorySessionById } from '../../middleware/session/store';
import { prepareSessionData, removeSessions } from '../../helpers/auth';
import { model } from 'mongoose';
import { AuthActions } from '../../logging/actions/auth/auth';
import { APIOperation, createErrorResponseData, createSuccessResponseData } from '../../logging/application-log';
import { clone } from '../../helpers/common';
import { IUser, IUserModel } from '../../models/users/users';

const UserModel = model('User') as IUserModel;

export const loginUser: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		const data = req.body;
		const currentSessionID = req.sessionID;
		const currentSession = req.session;

		if (!data.email || !data.password) {
			throwError(400);
		}
		const user = await UserModel.findOne({
			status: 'active',
			email: data.email,
		}).collation({ locale: 'en_US', numericOrdering: false });

		if (!user) {
			throwError(404);
		}

		if (!verifyHash(data.password, user.password)) {
			throwError(401);
		}

		const sessions = [];
		const sessionData = await prepareSessionData(user);
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
			AuthActions.login_user(req, {
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
			AuthActions.login_user(req, {
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

		const user = await UserModel.findByIdAndUpdate(
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
			AuthActions.logout_user(req, {
				userId: user?._id?.toString(),
				response: createSuccessResponseData(),
			}),
		);

		return {};
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			AuthActions.logout_user(req, {
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
	console.log(data.password);
	if (!data || !data.firstName || !data.email || !data.password) {
		const errorCode = 400;
		const errorRes = res.createErrorResponse(errorCode);

		operation.errorLog(
			AuthActions.add_user(req, {
				data: data,
				response: createErrorResponseData(errorCode, errorRes),
			}),
		);
		res.errorRes(errorCode);
		cb(false);
		return;
	} else {
		const existingUser = await UserModel.findOne({
			email: data.email,
			status: { $ne: 'deleted' },
		})
			.lean()
			.collation({ locale: 'en_US', numericOrdering: false });

		if (existingUser) {
			const errorCode = 409;
			const errorRes = res.createErrorResponse(errorCode);
			operation.errorLog(
				AuthActions.add_user(req, {
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
		let data: IUser = req.body;

		// const files = req.files;

		// if (files?.length) {
		// 	for (const file of files) {
		// 		if (file.fieldname === 'avatar') {
		// 			data.avatar = file.location;
		// 		}
		// 		if (file.fieldname === 'thumb') {
		// 			data.thumb = file.location;
		// 		}
		// 	}
		// }

		let userData = clone(data);
		userData.password = createHash(data.password);

		const newUser = new UserModel(userData);
		await newUser.save();

		operation.log(
			AuthActions.add_user(req, {
				userId: newUser._id?.toString(),
				response: createSuccessResponseData(),
			}),
		);

		return {};
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		operation.errorLog(
			AuthActions.add_user(req, {
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
