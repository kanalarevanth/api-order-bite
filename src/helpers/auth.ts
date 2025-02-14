import { model } from 'mongoose';
import { destorySessionById, getSessionById, setSessionById } from '../middleware/session/store';
import logger from './logger';
import { IUser, IUserModel } from '../models/user/users';
import { IAdminUser, IAdminUserModel } from '../models/admin/admin-users';

const UserModel = model('User') as IUserModel;

export const removeSessions = async (user: IUser, currentSession, currentSessionID) => {
	try {
		for (const session of user.sessions) {
			if (session === currentSessionID) {
				currentSession.destroy();
			}
			const sessionDetails = await getSessionById(session);
			if (sessionDetails) {
				destorySessionById(session);
			}
		}
	} catch (error) {
		logger.error(error);
	}
	return user;
};

export const prepareSessionData = async (userData: IUser) => {
	const user: IUser = JSON.parse(JSON.stringify(userData));

	let updatedAt = new Date(user.updatedAt);

	const sessionData: SessionUser = {
		_id: user._id?.toString(),
		status: user.status,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		avatar: user.avatar,
		thumb: user.thumb,
		updatedAt: updatedAt,
	};

	return sessionData;
};

export const prepareAdminSessionData = async (userData: IAdminUser) => {
	const user = JSON.parse(JSON.stringify(userData));

	let updatedAt = new Date(user.updatedAt);

	const sessionData: SessionAdminUser = {
		_id: user._id?.toString(),
		status: user.status,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		avatar: user.avatar,
		thumb: user.thumb,
		restaurant: user.restaurant,
		updatedAt: updatedAt,
	};

	return sessionData;
};
