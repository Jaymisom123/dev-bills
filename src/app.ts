import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import routes from './routes';

const app: FastifyInstance = Fastify({
	logger: true,
});

app.register(routes);

export default app;
