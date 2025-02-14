import { AuthActions } from './user/user-auth';
import { AdminAuthActions } from './admin/admin-auth';
import { RestaurantMenuActions } from './admin/admin-recipe';

export type LogAction =
	| ReturnType<(typeof AuthActions)[keyof typeof AuthActions]>
	| ReturnType<(typeof AdminAuthActions)[keyof typeof AdminAuthActions]>
	| ReturnType<(typeof RestaurantMenuActions)[keyof typeof RestaurantMenuActions]>;
