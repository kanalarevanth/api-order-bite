import mongoose from 'mongoose';
import logger from './logger';

const { APP_MONGO_URI } = process.env;

export const connectMongoDB = async () => {
	try {
		await mongoose.connect(APP_MONGO_URI);
		mongoose.set('allowDiskUse', true);
		logger.info('Connected to MongoDB');
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};
