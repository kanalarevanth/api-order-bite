export type IApplicationLog = Partial<{
	type: 'info' | 'error' | 'debug';
	platform: 'api' | 'web';
	module: string;
	feature: string;
	actionType: 'add' | 'update' | 'delete' | 'read' | 'other';
	action: string;
	severity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
	message: string;
	userId: string;
	by: string;
	byOrderBite: string;
	entity: string;
	entityId: string;
	tags: string[];
	data: any;
	updatedData: any;
	api: Partial<{
		packageName: string;
		packageVersion: string;
		apiVersion: string;
		userAgent: string;
		ip: string;
		sessionId: string;
		socketId: string;
		endpoint: string;
		method: 'get' | 'post' | 'delete' | 'update' | 'message';
		response: Partial<{
			success: boolean;
			status: number;
			error: Partial<{
				code: string;
				message: string;
			}>;
		}>;
		meta: any;
	}>;
	system: Partial<{
		packageName: String;
		packageVersion: String;
		platform: string;
		meta: any;
	}>;
	web: Partial<{
		packageName: String;
		packageVersion: String;
		userAgent: string;
		ip: string;
		sessionId: string;
		socketId: string;
		route: string;
		meta: any;
	}>;
}>;

export type ResponseData = IApplicationLog['api']['response'];

export type SocketInfo = Partial<{
	id: string;
}>;
