import throwError from '../../helpers/error';
import { MulterValidatorFn } from '../../helpers/multer';
import { APIOperation, createErrorResponseData, createSuccessResponseData } from '../../logging/application-log';
import { clone } from '../../helpers/common';

export const validateAddRecipe: MulterValidatorFn = async (req, res, data, cb) => {
	// if (!data || !data.name) {
	// 	const errorCode = 400;
	// 	const errorRes = res.createErrorResponse(errorCode);

	// 	res.errorRes(errorCode);
	// 	cb(false);
	// 	return;
	// }
	cb(true);
};

export const addAdminRecipe: APIController = async (req, res) => {
	const operation = new APIOperation();
	try {
		const files = req.files;
		const data = req.body;

		if (files?.length) {
			for (const file of files) {
				if (file.fieldname === 'image') {
					data.avatar = file.path;
				}
				if (file.fieldname === 'thumb') {
					data.avatar = file.path;
				}
			}
		}

		return;
	} catch (error) {
		const errorCode = error?.status || 500;
		const errorRes = res.createErrorResponse(errorCode, error?.error, error?.errorCode);
		throw error;
	}
};
