import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../../config/prisma';

export const listCategories = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' },
		});
		return reply.status(200).send({
			status: 'success',
			data: { categories },
		});
	} catch (error) {
		return reply.status(500).send({
			status: 'error',
			message: 'Erro ao listar categorias',
		});
	}
};
