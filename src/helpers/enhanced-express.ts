import { Request, NextFunction, Response } from 'express';

declare global {
	namespace Express {
		class Request {
			validationCompleted: boolean;
			validationResult: boolean;
			files: any[];
		}
		interface Response {
			/**
			 * Default Error Codes : 400, 401, 404, 409, 500
			 */
			errors: {
				[code: number]: {
					status: number;
					errorCode: string;
					error: string;
				};
			};
			/**
			 * Send Success Response (Single Item Response)
			 * @param {any} resData Data to send as response
			 * @param {number} code Success Response HTTP code 200 or other
			 */
			successRes(resData?: any, code?: number): any;
			/**
			 * Send Success Response (Paginated Response)
			 * @param {any} resData Data to send as response
			 * @param {number} code Success Response code 200 or other
			 *
			 * Sends response with body params data (array of items), total, page, limit, search, sort, order, etc.
			 */
			successPaginatedRes(resData: any, code?: number): any;
			createErrorResponse(code?: any, error?: any, errorCode?: any): any;
			/**
			 * Send Error response using default error codes mentioned in errors object
			 * @param {number} code Error Response HTTP code (default 500)
			 * @param {boolean} sendSessionUser Send Session User (true | false, default false)
			 */
			errorRes(code?: any, sendSessionUser?: boolean): any;
			/**
			 * Send custom error response
			 * @param @param {number} status Response HTTP code
			 * @param {any} error Error Object
			 * @param {string} errorCode Error Code string (Capitalised error code) (Ex: 'SERVER_ERROR')
			 */
			customErrorRes(status: any, error?: any, errorCode?: any): any;
			/**
			 * Handle Request
			 * @param {function} controllerRef Controller Function Reference (must return a Promise)
			 * @param {any|Array<any>} controllerParams Parameters to pass in Controller Function Call
			 * @param {'paginated'|'simple'} responseType Type of response ('paginated' | 'simple')
			 * @param {any|Array<any>} printOnError Array of data to print when error occurs
			 */
			handle(controllerRef: (...p: any[]) => Promise<any>, responseType?: 'paginated' | 'simple', printOnError?: any): void;
			/**
			 * Handle Error Response
			 * @param {any} error Error object
			 * @param {any|Array<any>} printData Array of data to print when error occurs
			 */
			handleErrorRes(error?: any, ...printData: any): any;
		}
		export interface Application {}
	}
}
/**
 * Enhance Express Functionalities - Adds following extra functionality to express request and response objects
 *
 * @param {Object} options Options
 * @param {any} [options.logger] Logger (console (default) / log4js / others)
 *
 * **Response Object :**
 * - `errors` - Default Error Codes `400`, `401`, `404`, `409`, `500`
 * - `successRes()` - Send Success Response (Single Item Response)
 * - `successPaginatedRes()` - Send Success Response (Paginated Response)
 * - `errorRes()` - Send Error response using default error codes mentioned in errors object
 * - `customErrorRes()` - Send custom error response
 * - `handle()` - Handle Request
 * - `handleErrorRes()` - Handle Error Response
 */
const enhance = (options?: { logger?: any }): ((req: Request, res: Response, next: NextFunction) => void) => {
	const log = options?.logger || console;

	/**
	 * Enhance Middleware Function
	 * @param {Request} request Express Request Object
	 * @param {Response} response Express Response Object
	 * @param {Function} next Express Next Function
	 */
	function middleware(request, response, next) {
		/**
		 * Default Error Codes : 400, 401, 404, 409, 500
		 * ```
		 * errors: {
		 *   [code: number]: {
		 *      status: number,
		 *      errorCode: string,
		 *      error: string
		 *    }
		 * }
		 * ```
		 */
		response.errors = {
			400: {
				status: 400,
				errorCode: 'BAD_REQUEST',
				error: 'Bad request',
			},
			401: {
				status: 401,
				errorCode: 'UNAUTHORIZED',
				error: 'Not authorized',
			},
			403: {
				status: 403,
				errorCode: 'FORBIDDEN',
				error: 'Operation Not Permitted',
			},
			404: {
				status: 404,
				errorCode: 'NOT_FOUND',
				error: 'Not found',
			},
			409: {
				status: 409,
				errorCode: 'DATA_CONFLICT',
				error: 'Already exists',
			},
			500: {
				status: 500,
				errorCode: 'SERVER_ERROR',
				error: 'Server error',
			},
		} as const;

		/**
		 * Send Success Response (Single Item Response)
		 * @param {any} resData Data to send as response
		 * @param {number} code Success Response HTTP code 200 or other
		 */
		response.successRes = function (resData, code) {
			this.status(code || 200).json({
				status: 'SUCCESS',
				data: resData || null,
			});
		};
		/**
		 * Send Success Response (Paginated Response)
		 * @param {any} resData Data to send as response
		 * @param {number} code Success Response code 200 or other
		 *
		 * Sends response with body params data (array of items), total, page, limit, search, sort, order, etc.
		 */
		response.successPaginatedRes = function (resData, code) {
			this.status(code || 200).json({
				status: 'SUCCESS',
				...resData,
			});
		};

		response.createErrorResponse = function (code = 500, error = null, errorCode = null) {
			return {
				status: 'ERROR',
				error: error || (this.errors[code] ? this.errors[code].error : ''),
				errorCode: errorCode || (this.errors[code] ? this.errors[code].errorCode : ''),
			};
		};

		/**
		 * Send Error response using default error codes mentioned in errors object
		 * @param {number} code Error Response HTTP code (default 500)
		 */
		response.errorRes = function (code = 500) {
			const errorRes = this.createErrorResponse(code);
			this.status(this.errors[code] ? this.errors[code].status : code).json(errorRes);
		};
		/**
		 * Send custom error response
		 * @param {number} status Response HTTP code
		 * @param {any} error Error Object
		 * @param {string} errorCode Error Code string (Capitalised error code) (Ex: 'SERVER_ERROR')
		 */
		response.customErrorRes = function (status, error, errorCode) {
			this.status(status).json(this.createErrorResponse(status, error, errorCode));
		};
		/**
		 * Handle Request
		 * @param {function} controllerRef Controller Function Reference (must return a Promise)
		 * @param {'paginated'|'simple'} responseType Type of response ('paginated' | 'simple')
		 * @param {any|Array<any>} printOnError Array of data to print when error occurs
		 */
		response.handle = function (controllerRef, responseType = 'simple', printOnError = []) {
			if (!(printOnError instanceof Array)) {
				printOnError = [printOnError];
			}
			controllerRef(request, response)
				.then((data) => {
					if (responseType === 'paginated') {
						this.successPaginatedRes(data);
					} else {
						this.successRes(data);
					}
				})
				.catch((error) => this.handleErrorRes(error, ...printOnError));
		};
		/**
		 * Handle Error Response
		 * @param {any} error Error object
		 * @param {any|Array<any>} printData Array of data to print when error occurs
		 */
		response.handleErrorRes = function (error, ...printData) {
			printData = printData || [];
			if (!(printData instanceof Array)) {
				printData = [printData];
			}
			log.error(this.req.method, this.req.baseUrl + this.req.path, ...printData, error);
			if (error?.status && (error.errorCode || error.error)) {
				this.customErrorRes(error.status, error.error, error.errorCode);
			} else if (error?.status && this.errors[error.status]) {
				this.errorRes(error.status);
			} else if (error?.status) {
				this.customErrorRes(error.status, error.error, error.errorCode);
			} else {
				this.errorRes(500);
			}
		};
		// Call next function
		next();
	}
	return middleware;
};

export default enhance;
