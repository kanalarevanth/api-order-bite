import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../../helpers/database-redis';

const { APP_SESSION_TOKEN_PREFIX } = process.env;

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	if (req.session?.user) {
		next();
	} else {
		if (req.originalUrl?.includes('/v1/app')) {
			const authHeader = req.get('Authorization');
			if (authHeader?.includes('Bearer ') && authHeader.split('Bearer ')[1]) {
				let session = await redisClient.directGet(APP_SESSION_TOKEN_PREFIX + authHeader.split('Bearer ')[1]);
				req.session = session;
				if (session?.user) {
					next();
				} else {
					res.setHeader('SESSION_EXPIRED', 'YES');
					res.errorRes(401);
				}
			} else {
				res.setHeader('SESSION_EXPIRED', 'YES');
				res.errorRes(401);
			}
		} else {
			res.setHeader('SESSION_EXPIRED', 'YES');
			res.errorRes(401);
		}
	}
};
