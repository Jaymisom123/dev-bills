import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, type ZodSchema } from 'zod';
import logger from '../utils/logger';

interface ValidationSchemas {
	body?: ZodSchema;
	params?: ZodSchema;
	query?: ZodSchema;
	headers?: ZodSchema;
}

export const validationMiddleware = (schemas: ValidationSchemas) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			// Validar body
			if (schemas.body && request.body) {
				request.body = schemas.body.parse(request.body);
			}

			// Validar params
			if (schemas.params && request.params) {
				request.params = schemas.params.parse(request.params);
			}

			// Validar query
			if (schemas.query && request.query) {
				request.query = schemas.query.parse(request.query);
			}

			// Validar headers
			if (schemas.headers && request.headers) {
				request.headers = schemas.headers.parse(request.headers);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				const validationErrors = error.errors.map((err) => ({
					field: err.path.join('.'),
					message: err.message,
					code: err.code,
				}));

				logger.warn('Erro de validação:', {
					url: request.url,
					method: request.method,
					errors: validationErrors,
				});

				return reply.status(400).send({
					status: 'error',
					message: 'Dados inválidos',
					code: 'VALIDATION_ERROR',
					errors: validationErrors,
				});
			}

			// Erro não esperado
			logger.error('Erro inesperado na validação:', error);
			return reply.status(500).send({
				status: 'error',
				message: 'Erro interno do servidor',
				code: 'INTERNAL_ERROR',
			});
		}
	};
};
