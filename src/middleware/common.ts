import { checkAuth } from './auth/auth';
import { checkQuery } from './query';

const middlewares = [checkQuery];

export const withAuth = () => {
	return [...middlewares, checkAuth];
};
export const withoutAuth = () => {
	return [...middlewares];
};
