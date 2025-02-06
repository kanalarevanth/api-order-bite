import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const UPLOAD_DIR = './uploads';

export type MulterValidatorFn = (req: Request, res: Response, data: any, cb: (upload: boolean, moveForward?: boolean) => any, file?: any) => {};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, UPLOAD_DIR);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const fileFilter = (req, file, cb) => {
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(new Error('Only image files are allowed!'), false);
	}
};

const formDatatoJSON = (req) => {
	if (req.get('Content-Type')?.includes('multipart/form-data')) {
		if (req.body.data) {
			if (typeof req.body.data === 'string') {
				try {
					return JSON.parse(req.body.data);
				} catch (error) {
					logger.error('Cannot parse multipart body : ', error);
				}
			} else {
				return req.body.data;
			}
		}
	}
	return req.body;
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 4 * 1024 * 1024 },
});

export const useMultipart = (req: Request, res: Response, next: NextFunction) => {
	req.body = formDatatoJSON(req);
	next();
};

export const multerValidation = function (validatorFn?: MulterValidatorFn) {
	return [
		(req: Request, res: Response, next: NextFunction) => {
			const handleMulterError = (error) => {
				if (error) {
					logger.error(error);
					res.errorRes(500);
				} else {
					next();
				}
			};

			upload.any()(req, res, handleMulterError);
		},
		(req, res, next) => {
			if (req.validationResult === false) {
				return;
			} else if (req.validationResult === true) {
				next();
			} else {
				validatorFn(req, res, formDatatoJSON(req), (result, moveForward = false) => {
					req.validationCompleted = true;
					req.validationResult = !!result;
					if (result || moveForward) {
						next();
					} else {
						return;
					}
				});
			}
		},
		useMultipart,
	];
};
