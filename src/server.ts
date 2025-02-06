import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import logger from './helpers/logger';

import enhance from './helpers/enhanced-express';
import { connectMongoDB } from './helpers/database-mongodb';
import { connectRedis } from './helpers/database-redis';
import { initModels } from './models';

const app = express();

initModels();

import apiRouter from './routes';
import { handleCORS } from './middleware/cors';
import handleSession from './middleware/session/session';
import { initSessionStore, getSessionStore, ttl } from './middleware/session/store';

const startApp = async () => {
	await connectMongoDB();
	await connectRedis();

	app.use(handleCORS);

	initSessionStore();

	app.enable('trust proxy');
	app.use(
		handleSession({
			store: getSessionStore(),
			maxAge: ttl * 1000,
		}),
	);
	app.use(express.json({ limit: '100mb' }));
	app.use(
		express.urlencoded({
			limit: '100mb',
			extended: true,
		}),
	);

	app.use(
		enhance({
			logger: logger,
		}),
	);
	app.get('/testlb', (req, res) => {
		res.status(200).send('test response');
	});

	app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

	app.use(process.env.APP_BASE_URL, apiRouter);

	app.use((req, res) => {
		res.sendStatus(404);
	});

	app.listen(process.env.APP_PORT || 3001, () => {
		logger.info(`server is running on : ${process.env.APP_PORT} with the single worker ${process.pid}`);
	});
};

startApp();
