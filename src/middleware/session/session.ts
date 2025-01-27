import { Request, NextFunction, Response } from 'express';
import { sync } from 'uid-safe';
import { createHash } from 'crypto';
import { RedisSessionStore } from './redis-session-store';

declare global {
	namespace Express {
		interface Request {
			sessionID: string;
			session: TokenSession;
		}
	}
}

declare type TokenSession = {
	user: SessionUser;
	[key: string | number]: any;
} & {
	destroy(): void;
};

/**
 * @typedef { import("express").Request } Request
 * @typedef { import("express").Response } Response
 */

/**
 *  Function to generate hash of Session data
 */
const _hash = (sessionData: any) => {
	const str = JSON.stringify(sessionData);

	// return Hash
	return createHash('sha1').update(str, 'utf8').digest('hex');
};

/**
 * Function to Generate a new Token
 */
const _generateToken = () => sync(24); // Token length = 24 characters

/**
 * Function to get Session from database store
 * @param {Object} [_store] Session Store
 * @param {String} [_sessionID] Token Session ID
 * @returns {Promise}
 */
const _getSession = async (_store: RedisSessionStore, _sessionID: string) => {
	try {
		return await _store.get(_sessionID);
	} catch (err) {
		return null;
	}
};

/**
 * Session Middleware Generator Function
 * @param {Object} [options] Options
 * @param {any} [options.store] Session Storage Database Store Client
 * @param {Number} [options.maxAge]  Max Age of Session - In milliseconds, Default (24 Hours) : 24 * 60 * 60 * 1000
 */
const handleSession: (options: { store: RedisSessionStore; maxAge: number }) => (req: Request, res: Response, next: NextFunction) => any = (options) => {
	const _store = options.store; // Session Storage Database Store Client
	const _maxAge = options.maxAge || 24 * 60 * 60 * 60 * 1000; // Max Age of Session - In milliseconds, Default (24 Hours) : 24 * 60 * 60 * 1000

	/**
	 * SessionMiddleware
	 * @param {Request} [req] Express.Request
	 * @param {Response} [res] Express.Response
	 * @param {Function} [next] Next Function
	 */
	const _sessionMiddleware = async (req, res, next) => {
		try {
			let destroyed = false;
			const destroySession = () => {
				if (req.sessionID) {
					destroyed = true;
					_store.destroy(req.sessionID);
				}
			};

			if (req.sessionID && req.session) {
				next();
			} else {
				let _originalData; // Data of session when request started
				let _originalHash; // Hash of _originalData
				let _token; // Auth Token for current request

				const generateNewSession = () => {
					_token = _generateToken(); // New Token
					const _tokenData = {
						_expiry: new Date(Number(new Date()) + _maxAge),
					};

					req.sessionID = _token;
					req.session = _tokenData;

					_originalData = _tokenData;
					_originalHash = _hash(_originalData);
				};

				const authHeader = req.get('Authorization');
				if (authHeader?.includes('Bearer ') && authHeader.split('Bearer ')[1]) {
					// Token exists in Header
					_token = authHeader.split('Bearer ')[1];
					_originalData = await _getSession(_store, _token);
					if (_originalData) {
						_originalHash = _hash(_originalData);

						req.sessionID = _token;
						req.session = _originalData;
						if (req.session._expiry) {
							const todayTime = new Date().getTime();
							const expiryTime = new Date(req.session._expiry).getTime();
							const _timeElapsed = todayTime - (expiryTime - _maxAge);
							if (_timeElapsed > 5000) {
								req.session._expiry = new Date(Number(Date.now()) + _maxAge);
							}
						} else {
							req.session._expiry = new Date(Number(Date.now()) + _maxAge);
						}
					} else {
						generateNewSession();
					}
				} else {
					// Token does not exist in Header
					generateNewSession();
				}

				Object.defineProperty(req.session, 'destroy', {
					configurable: true,
					enumerable: false,
					value: destroySession,
					writable: true,
				});

				const _end = res.end; // Copy Response.End Function

				res.end = (chunk, encoding) => {
					if (!destroyed) {
						if (!req.session) {
							return _end.call(res, chunk, encoding);
						}

						let hashChanged = false;
						if (_hash(req.session) !== _originalHash) {
							hashChanged = true;
						}

						if (hashChanged) {
							_store.set(req.sessionID, req.session);
						}
					}

					return _end.call(res, chunk, encoding);
				};
				next();
			}
		} catch (error) {
			next();
		}
	};
	return _sessionMiddleware;
};

export default handleSession;
