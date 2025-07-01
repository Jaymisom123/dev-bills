import type { FastifyInstance } from 'fastify';
import { listCategories } from '../controllers/categories/listCategories.controller';
import { createTransaction } from '../controllers/transactions/createTransaction.controller';
import { deleteTransaction } from '../controllers/transactions/deleteTransaction.controller';
import { getTransactionsSummary } from '../controllers/transactions/getTransactionsSummary.controller';
import { listTransactions } from '../controllers/transactions/listTransactions.controller';
import { getUser } from '../controllers/users/getUser.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import authRoutes from './auth';

async function routes(fastify: FastifyInstance): Promise<void> {
	// Health check (rota pública)
	fastify.get('/health', async (request, reply) => {
		return reply.status(200).send({
			status: 'success',
			message: 'API funcionando corretamente',
			timestamp: new Date().toISOString(),
		});
	});

	// Rotas de autenticação (algumas públicas, outras protegidas)
	fastify.register(authRoutes, { prefix: '/auth' });

	// Rotas de Transações (protegidas)
	fastify.get(
		'/transactions/summary',
		{
			preHandler: [authMiddleware],
		},
		getTransactionsSummary,
	);
	fastify.delete(
		'/transactions/:id',
		{
			preHandler: [authMiddleware],
		},
		deleteTransaction,
	);
	fastify.get(
		'/transactions',
		{
			preHandler: [authMiddleware],
		},
		listTransactions,
	);
	fastify.post(
		'/transactions',
		{
			preHandler: [authMiddleware],
		},
		createTransaction,
	);

	// Rotas de Categorias (temporariamente sem auth para teste)
	fastify.get('/categories', listCategories);

	// Rotas de Usuário (protegidas)
	fastify.get(
		'/user',
		{
			preHandler: [authMiddleware],
		},
		getUser,
	);
}

export default routes;
