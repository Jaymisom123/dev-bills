import type { FastifyInstance } from 'fastify';
import { transactionController } from '../controllers';
import { validationMiddleware } from '../middleware/validation.middleware';
import {
	balanceQuerySchema,
	createTransactionSchema,
	transactionParamsSchema,
	transactionsQuerySchema,
	updateTransactionSchema,
} from '../schemas';

async function transactionRoutes(fastify: FastifyInstance): Promise<void> {
	// GET /transactions - Listar transações
	fastify.get(
		'/',
		{
			preHandler: [validationMiddleware({ query: transactionsQuerySchema })],
		},
		transactionController.getTransactions.bind(transactionController),
	);

	// GET /transactions/balance - Calcular balanço
	fastify.get(
		'/balance',
		{
			preHandler: [validationMiddleware({ query: balanceQuerySchema })],
		},
		transactionController.getBalance.bind(transactionController),
	);

	// GET /transactions/:id - Buscar transação por ID
	fastify.get(
		'/:id',
		{
			preHandler: [validationMiddleware({ params: transactionParamsSchema })],
		},
		transactionController.getTransactionById.bind(transactionController),
	);

	// POST /transactions - Criar transação
	fastify.post(
		'/',
		{
			preHandler: [validationMiddleware({ body: createTransactionSchema })],
		},
		transactionController.createTransaction.bind(transactionController),
	);

	// PUT /transactions/:id - Atualizar transação
	fastify.put(
		'/:id',
		{
			preHandler: [
				validationMiddleware({
					params: transactionParamsSchema,
					body: updateTransactionSchema,
				}),
			],
		},
		transactionController.updateTransaction.bind(transactionController),
	);

	// DELETE /transactions/:id - Deletar transação
	fastify.delete(
		'/:id',
		{
			preHandler: [validationMiddleware({ params: transactionParamsSchema })],
		},
		transactionController.deleteTransaction.bind(transactionController),
	);
}

export default transactionRoutes;
