import type { FastifyReply, FastifyRequest } from 'fastify';
import { createTransaction } from './createTransaction.controller';
import { deleteTransaction } from './deleteTransaction.controller';
import { getTransactionsSummary } from './getTransactionsSummary.controller';
import { listTransactions } from './listTransactions.controller';

export { createTransaction } from './createTransaction.controller';
export { deleteTransaction } from './deleteTransaction.controller';
export { getTransactionsSummary } from './getTransactionsSummary.controller';
export { listTransactions } from './listTransactions.controller';

class TransactionController {
	async getTransactions(request: FastifyRequest, reply: FastifyReply) {
		return listTransactions(request, reply);
	}

	async createTransaction(request: FastifyRequest, reply: FastifyReply) {
		return createTransaction(request, reply);
	}

	async deleteTransaction(request: FastifyRequest, reply: FastifyReply) {
		return deleteTransaction(request, reply);
	}

	async getTransactionsSummary(request: FastifyRequest, reply: FastifyReply) {
		return getTransactionsSummary(request, reply);
	}

	async getTransactionById(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}

	async updateTransaction(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}

	async getBalance(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}
}

export const transactionController = new TransactionController();
