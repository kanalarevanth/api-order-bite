import cors from 'cors';

const corsOptions = {
	origin: (origin, callback) => {
		callback(null, true);
	},
	exposedHeaders: [
		'RENEW_USER',
		'APP_NAME_REQUIRED',
		'UNKNOWN_APP',
		'VERSION_REQUIRED',
		'VERSION_EXPIRED',
		'UPDATE_AVAILABLE',
		'NEW_VERSION',
		'NEW_VERSION_DESC',
		'MAINTENANCE',
		'SESSION_EXPIRED',
		'FORBIDDEN',
	],
};

export const handleCORS = (req, res, next) => {
	cors(corsOptions)(req, res, (error) => {
		if (error) {
			res.sendStatus(401);
		} else {
			next();
		}
	});
};
