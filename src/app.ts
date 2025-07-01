import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { env, isDevelopment } from './config/env';
import { initializeFirebase } from './config/firebase';
import routes from './routes';
import logger from './utils/logger';

// Inicializar Firebase
try {
	initializeFirebase();
} catch (error) {
	logger.warn('Firebase não foi inicializado:', error);
	logger.info('A aplicação continuará funcionando sem Firebase');
}

const app: FastifyInstance = Fastify({
	logger: {
		level: env.LOG_LEVEL,
		transport: isDevelopment
			? {
					target: 'pino-pretty',
					options: {
						translateTime: 'HH:MM:ss Z',
						ignore: 'pid,hostname',
					},
				}
			: undefined,
	},
});

// Registrar CORS
logger.debug('CORS Origin configurado para:', env.CORS_ORIGIN);
app.register(cors, {
	origin: env.CORS_ORIGIN,
	credentials: true,
});

// Registrar rotas
app.register(routes, { prefix: '/api' });

export default app;
