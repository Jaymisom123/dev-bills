import type { FastifyInstance } from 'fastify';
import { categoryController } from '../controllers';
import { validationMiddleware } from '../middleware/validation.middleware';
import {
	categoriesQuerySchema,
	categoryParamsSchema,
	createCategorySchema,
	updateCategorySchema,
} from '../schemas';

async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
	// GET /categories - Listar categorias
	fastify.get(
		'/',
		{
			preHandler: [validationMiddleware({ query: categoriesQuerySchema })],
		},
		categoryController.getCategories.bind(categoryController),
	);

	// GET /categories/:id - Buscar categoria por ID
	fastify.get(
		'/:id',
		{
			preHandler: [validationMiddleware({ params: categoryParamsSchema })],
		},
		categoryController.getCategoryById.bind(categoryController),
	);

	// POST /categories - Criar categoria
	fastify.post(
		'/',
		{
			preHandler: [validationMiddleware({ body: createCategorySchema })],
		},
		categoryController.createCategory.bind(categoryController),
	);

	// PUT /categories/:id - Atualizar categoria
	fastify.put(
		'/:id',
		{
			preHandler: [
				validationMiddleware({
					params: categoryParamsSchema,
					body: updateCategorySchema,
				}),
			],
		},
		categoryController.updateCategory.bind(categoryController),
	);

	// DELETE /categories/:id - Deletar categoria
	fastify.delete(
		'/:id',
		{
			preHandler: [validationMiddleware({ params: categoryParamsSchema })],
		},
		categoryController.deleteCategory.bind(categoryController),
	);
}

export default categoryRoutes;
