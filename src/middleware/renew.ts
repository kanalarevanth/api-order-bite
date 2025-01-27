import { NextFunction, Request, Response } from 'express';
export const UpdatedAtHeader = 'UPDATED-USER-AT';
export const RenewHeader = 'RENEW_USER';

export const checkRenewUser = (req: Request, res: Response, next: NextFunction) => {
	const user = req.session?.user;
	const updatedAtString = req.get(UpdatedAtHeader);

	if (user && updatedAtString) {
		if (new Date(user.updatedAt).toISOString() !== new Date(updatedAtString).toISOString()) {
			res.setHeader(RenewHeader, 'YES');
		}
	}
	next();
};
