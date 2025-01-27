const { APP_HASH_SECRETKEY } = process.env;
import { createHmac } from 'crypto';

export const createHash = (string) => {
	const hashedPassword = createHmac('sha256', APP_HASH_SECRETKEY || 'password-key')
		.update(string)
		.digest('hex');
	return hashedPassword;
};

export const verifyHash = (string, hash) => {
	const passwordHash = createHash(string);
	return passwordHash === hash;
};
