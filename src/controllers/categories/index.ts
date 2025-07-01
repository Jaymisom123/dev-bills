import type { FastifyReply, FastifyRequest } from 'fastify';
import { listCategories } from './listCategories.controller';

export { listCategories } from './listCategories.controller';

class CategoryController {
	async getCategories(request: FastifyRequest, reply: FastifyReply) {
		return listCategories(request, reply);
	}

	async getCategoryById(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}

	async createCategory(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}

	async updateCategory(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}

	async deleteCategory(request: FastifyRequest, reply: FastifyReply) {
		return reply.status(501).send({
			status: 'error',
			message: 'Método não implementado',
		});
	}
}

export const categoryController = new CategoryController();
