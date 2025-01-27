const throwError = (status, errorCode?, error?) => {
	throw {
		status: status || 500,
		...(errorCode ? { errorCode: errorCode } : {}),
		...(error ? { error: error } : {}),
	};
};

export default throwError;
