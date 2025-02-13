declare type RedisClient = ReturnType<typeof import('redis').createClient>;
declare type APIController = (req: import('express').Request, res: import('express').Response) => any;

type _IUser = import('./models/users/users').IUser;
declare type SessionUser = {
	_id: string;
	status: _IUser['status'];
	firstName: _IUser['firstName'];
	lastName: _IUser['lastName'];
	email: _IUser['email'];
	avatar: _IUser['avatar'];
	thumb: _IUser['thumb'];
	updatedAt: _IUser['updatedAt'];
};

type _IAdminUser = import('./models/users/admin-users').IAdminUser;
declare type SessionAdminUser = {
	_id: string;
	status: _IAdminUser['status'];
	firstName: _IAdminUser['firstName'];
	lastName: _IAdminUser['lastName'];
	email: _IAdminUser['email'];
	avatar: _IAdminUser['avatar'];
	thumb: _IAdminUser['thumb'];
	restaurant: {
		_id: string;
		name: string;
		logo: string;
		address: {
			country: string;
			state: string;
			city: string;
			area: string;
			pinCode: string;
		};
	};
	updatedAt: _IUser['updatedAt'];
};
