import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma';

export const getTransactionsSummary = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const totalIncome = await prisma.transaction.aggregate({
			where: { type: 'INCOME' },
			_sum: { amount: true },
		});

		const totalExpense = await prisma.transaction.aggregate({
			where: { type: 'EXPENSE' },
			_sum: { amount: true },
		});

		return reply.status(200).send({
			status: 'success',
			data: {
				totalIncome: totalIncome._sum.amount || 0,
				totalExpense: totalExpense._sum.amount || 0,
				balance:
					(totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0),
			},
		});
	} catch (error) {
		return reply.status(500).send({
			status: 'error',
			message: 'Erro ao calcular resumo de transações',
		});
	}
};
