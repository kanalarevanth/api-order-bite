import { model } from 'mongoose';
import { destorySessionById, getSessionById, setSessionById } from '../middleware/session/store';
import logger from './logger';
import { IUser, IUserModel } from '../models/users/users';

const UserModel = model('User') as IUserModel;

export const checkAndUpdateSessions = async (userId: string, currentSession = null, currentSessionID = null) => {
	try {
		const user = await UserModel.findById(userId.toString());
		if (user) {
			const sessionData = await prepareSessionData(user);
			for (const sessionId of user.sessions) {
				const session = await getSessionById(sessionId);
				if (session) {
					if (currentSessionID === sessionId) {
						currentSession.user = sessionData;
					} else {
						session.user = sessionData;
						await setSessionById(sessionId, session);
					}
				}
			}
		}
		return user;
	} catch (error) {
		logger.error(error);
	}
};

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
