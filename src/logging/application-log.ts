import { Request } from 'express';
import logger from '../helpers/logger';
import { LogAction } from './actions';
import { IApplicationLog, ResponseData, SocketInfo } from './type';
import * as pkg from '../../package.json';
const { APP_LOG_URI, APP_LOG_TOKEN } = process.env;

export class Operation {
	logs: IApplicationLog[] = [];
	failedLogs = [];

	apiLog(action: LogAction) {
		const log: IApplicationLog = {
			platform: 'api',
			...action,
		};
		this.logs.push(log);
		this.sendLog(log);
	}

	private async sendLog(log: IApplicationLog) {
		if (APP_LOG_URI && APP_LOG_TOKEN) {
			try {
				const res = await fetch(APP_LOG_URI, {
					method: 'post',
					headers: {
						'content-type': 'application/json',
						Authorization: 'Bearer ' + APP_LOG_TOKEN,
					},
					body: JSON.stringify(log),
				});
			} catch (error) {
				logger.error(error);
			}
		} else {
			logger.info('Log Server Details Not Specified in process.env');
		}
	}
}

export class APIOperation extends Operation {
	log(action: LogAction) {
		this.apiLog(action);
	}

	errorLog(action: LogAction) {
		action.type = 'error';
		this.apiLog(action);
	}
}

export const createErrorResponseData = (code: number, error): ResponseData => {
	return {
		success: false,
		status: code || 500,
		error: {
			code: error.errorCode || '',
			message: error.error || error.message || '',
		},
	};
};

export const createSuccessResponseData = (code: number = 200): ResponseData => {
	return {
		success: true,
		status: code || 200,
	};
};

export const getAPIDetails = (req: Request, responseData: ResponseData = null, meta: any = null, socket: SocketInfo = null): IApplicationLog['api'] => {
	const getRequestMethod = () => {
		if (socket) {
			return 'message';
		} else if (['get', 'post', 'delete', 'put'].includes(req.method.toLowerCase())) {
			return req.method.toLowerCase();
		} else {
			return null;
		}
	};
	const getAPIVersion = () => {
		const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
		if (req.originalUrl.startsWith('/v') && numbers.includes(req.originalUrl.charAt(2))) {
			const versionSegment = req.originalUrl.split('/')[1];
			const version = versionSegment.substr(1);
			return version;
		} else {
			return null;
		}
	};

	return {
		packageName: pkg.name,
		packageVersion: pkg.version,
		apiVersion: getAPIVersion(),
		userAgent: req.get('user-agent'),
		ip: req.ip,
		sessionId: req.sessionID,
		...(socket ? { socketId: socket.id } : {}),
		endpoint: req.originalUrl,
		method: getRequestMethod() as any,
		response: responseData || null,
		...(meta ? { meta } : {}),
	};
};
