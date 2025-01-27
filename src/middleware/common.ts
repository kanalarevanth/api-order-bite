import { checkAuth } from './auth/auth';
import { checkQuery } from './query';
import { checkRenewUser } from './renew';

const middlewares = [checkRenewUser, checkQuery];

export const withAuth = () => {
	return [...middlewares, checkAuth];
};
export const withoutAuth = () => {
	return [...middlewares];
};
