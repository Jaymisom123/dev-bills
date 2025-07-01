import type { FastifyInstance } from 'fastify';
import { authController } from '../controllers';
import { authMiddleware, requireAdmin } from '../middleware';
import { moderateRateLimit } from '../middleware/rateLimit.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import {
	createUserSchema,
	listUsersQuerySchema,
	setClaimsSchema,
	updateUserSchema,
	userParamsSchema,
} from '../schemas';

async function authRoutes(fastify: FastifyInstance): Promise<void> {
	// Rate limiting em todas as rotas
	fastify.addHook('preHandler', moderateRateLimit);

	// GET /auth/me
	fastify.get(
		'/me',
		{ preHandler: [authMiddleware] },
		authController.getMe.bind(authController),
	);

	// POST /auth/users
	fastify.post(
		'/users',
		{
			preHandler: [
				authMiddleware,
				requireAdmin,
				validationMiddleware({ body: createUserSchema }),
			],
		},
		authController.createUser.bind(authController),
	);

	// GET /auth/users/:uid
	fastify.get(
		'/users/:uid',
		{
			preHandler: [
				authMiddleware,
				requireAdmin,
				validationMiddleware({ params: userParamsSchema }),
			],
		},
		authController.getUserByUid.bind(authController),
	);

	// PUT /auth/users/:uid
	fastify.put(
		'/users/:uid',
		{
			preHandler: [
				authMiddleware,
				requireAdmin,
				validationMiddleware({
					params: userParamsSchema,
					body: updateUserSchema,
				}),
			],
		},
		authController.updateUser.bind(authController),
	);

	// DELETE /auth/users/:uid
	fastify.delete(
		'/users/:uid',
		{
			preHandler: [
				authMiddleware,
				requireAdmin,
				validationMiddleware({ params: userParamsSchema }),
			],
		},
		authController.deleteUser.bind(authController),
	);

	// POST /auth/users/:uid/claims
	fastify.post(
		'/users/:uid/claims',
		{
			preHandler: [
				authMiddleware,
				requireAdmin,
				validationMiddleware({
					params: userParamsSchema,
					body: setClaimsSchema,
				}),
			],
		},
		authController.setCustomClaims.bind(authController),
	);

	// GET /auth/users
	fastify.get(
		'/users',
		{
			preHandler: [
				authMiddleware,
				requireAdmin,
				validationMiddleware({ query: listUsersQuerySchema }),
			],
		},
		authController.listUsers.bind(authController),
	);
}

export default authRoutes;
