import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../../config/prisma';

export const deleteTransaction = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const paramsSchema = z.object({
			id: z.string().min(1, 'ID é obrigatório'),
		});

		const { id } = paramsSchema.parse(request.params);

		await prisma.transaction.delete({
			where: { id },
		});

		return reply.status(200).send({
			status: 'success',
			message: 'Transação deletada com sucesso',
		});
	} catch (error) {
		return reply.status(500).send({
			status: 'error',
			message: 'Erro ao deletar transação',
		});
	}
};
