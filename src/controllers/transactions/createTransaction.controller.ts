import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';

export const createTransaction = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const transactionSchema = z.object({
			amount: z.number().positive('Valor deve ser positivo'),
			description: z.string().min(1, 'Descrição é obrigatória'),
			categoryId: z.string().min(1, 'Categoria é obrigatória'),
			type: z.enum(['INCOME', 'EXPENSE']),
			date: z.string().datetime(),
			userId: z.string().min(1, 'ID do usuário é obrigatório'),
		});

		const transactionData = transactionSchema.parse(request.body);

		const transaction = await prisma.transaction.create({
			data: {
				amount: transactionData.amount,
				description: transactionData.description,
				categoryId: transactionData.categoryId,
				type: transactionData.type,
				date: new Date(transactionData.date),
				userId: transactionData.userId,
			},
			include: { category: true },
		});

		return reply.status(201).send({
			status: 'success',
			data: { transaction },
		});
	} catch (error) {
		console.error('Erro ao criar transação:', error);
		return reply.status(500).send({
			status: 'error',
			message: 'Erro ao criar transação',
		});
	}
};
