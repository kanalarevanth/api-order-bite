import logger from './logger';
import { createClient } from 'redis';

export var _redisConn: RedisClient;
const { APP_REDIS_URI, APP_SESSION_TOKEN_PREFIX } = process.env;

export const connectRedis = async () => {
	try {
		_redisConn = createClient({
			url: APP_REDIS_URI,
		});
		await _redisConn.connect();
		logger.info('Connected to Redis');

		_redisConn.on('error', (error) => {
			console.log('Redis Client Error', error);
		});

		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

export const redisClient = {
	get: (key) => {
		return _redisConn
			.get(APP_SESSION_TOKEN_PREFIX + key)
			.then((value) => JSON.parse(value))
			.catch((error) => error);
	},
	set: (key, value) => {
		return _redisConn
			.set(APP_SESSION_TOKEN_PREFIX + key, JSON.stringify(value))
			.then(() => JSON.parse(JSON.stringify(value)))
			.catch((error) => error);
	},
	del: (key) => {
		return _redisConn.del(APP_SESSION_TOKEN_PREFIX + key).catch((error) => error);
	},
	keys: (pattern: string): Promise<string[]> => {
		return _redisConn
			.keys(pattern)
			.then((value) => value)
			.catch((error) => error);
	},
	directGet: (key) => {
		return _redisConn
			.get(key)
			.then((value) => JSON.parse(value))
			.catch((error) => error);
	},
};
