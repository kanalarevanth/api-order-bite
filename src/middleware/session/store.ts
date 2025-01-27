import { RedisSessionStore } from './redis-session-store';
import { _redisConn } from '../../helpers/database-redis';

const { APP_SESSION_TOKEN_PREFIX, APP_SESSION_DURATION_DAYS } = process.env;

export const ttl = +(APP_SESSION_DURATION_DAYS || 15) * 24 * 60 * 60;

let sessionStore = null;

export const initSessionStore = () => {
	sessionStore = new RedisSessionStore({
		client: _redisConn,
		prefix: APP_SESSION_TOKEN_PREFIX,
		ttl: ttl,
	});
};

export const getSessionStore = () => {
	return sessionStore;
};

export const getSessionById = async (sessionId) => {
	try {
		return await sessionStore.get(sessionId);
	} catch (error) {
		return;
	}
};

export const setSessionById = async (sessionId, sessionData) => {
	try {
		await sessionStore.set(sessionId, sessionData);
		return;
	} catch (error) {
		return;
	}
};

export const destorySessionById = async (sessionId) => {
	try {
		await sessionStore.destroy(sessionId);
		return;
	} catch (error) {
		return;
	}
};
