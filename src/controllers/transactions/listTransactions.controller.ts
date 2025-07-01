import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';

export const listTransactions = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const querySchema = z.object({
			page: z.string().transform(Number).optional().default('1'),
			limit: z.string().transform(Number).optional().default('10'),
			type: z.enum(['INCOME', 'EXPENSE']).optional(),
		});

		const { page, limit, type } = querySchema.parse(request.query);
		const skip = (page - 1) * limit;

		const where = type ? { type } : {};

		const [transactions, total] = await Promise.all([
			prisma.transaction.findMany({
				where,
				skip,
				take: limit,
				orderBy: { date: 'desc' },
				include: { category: true },
			}),
			prisma.transaction.count({ where }),
		]);

		return reply.status(200).send({
			status: 'success',
			data: {
				transactions,
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(total / limit),
					totalItems: total,
				},
			},
		});
	} catch (error) {
		return reply.status(500).send({
			status: 'error',
			message: 'Erro ao listar transações',
		});
	}
};
