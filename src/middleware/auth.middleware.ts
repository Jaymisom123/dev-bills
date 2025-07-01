import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../config/firebase';
import logger from '../utils/logger';

// Interface para usuário autenticado
export interface AuthenticatedUser {
	uid: string;
	email?: string;
	name?: string;
	emailVerified: boolean;
	role?: string;
}

// Estender a interface do Fastify para incluir o usuário
declare module 'fastify' {
	interface FastifyRequest {
		user?: AuthenticatedUser;
	}
}

// Middleware de autenticação Firebase
export const authMiddleware = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const authorization = request.headers.authorization;

		if (!authorization) {
			return reply.status(401).send({
				status: 'error',
				message: 'Token de autorização não fornecido',
				code: 'MISSING_AUTH_TOKEN',
			});
		}

		// Extrair token do cabeçalho "Bearer TOKEN"
		const token = authorization.split(' ')[1];

		if (!token) {
			return reply.status(401).send({
				status: 'error',
				message: 'Token mal formatado. Formato esperado: Bearer <token>',
				code: 'INVALID_AUTH_FORMAT',
			});
		}

		// Verificar token com Firebase
		const decodedToken = await verifyToken(token);

		// Adicionar informações do usuário ao request
		request.user = {
			uid: decodedToken.uid,
			email: decodedToken.email,
			name: decodedToken.name,
			emailVerified: decodedToken.email_verified || false,
			role: decodedToken.role || 'user',
		} as AuthenticatedUser;

		logger.debug('Usuário autenticado:', {
			uid: request.user.uid,
			email: request.user.email,
		});
	} catch (error) {
		logger.error('Erro na autenticação Firebase:', error);
		return reply.status(401).send({
			status: 'error',
			message: 'Token inválido ou expirado',
			code: 'INVALID_TOKEN',
		});
	}
};

// Middleware opcional de autenticação (não bloqueia se não houver token)
export const optionalAuthMiddleware = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const authorization = request.headers.authorization;

		if (!authorization) {
			// Continua sem autenticação
			return;
		}

		const token = authorization.split(' ')[1];

		if (!token) {
			// Continua sem autenticação
			return;
		}

		// Tentar verificar token
		const decodedToken = await verifyToken(token);

		// Adicionar informações do usuário ao request
		request.user = {
			uid: decodedToken.uid,
			email: decodedToken.email,
			name: decodedToken.name,
			emailVerified: decodedToken.email_verified || false,
			role: decodedToken.role || 'user',
		} as AuthenticatedUser;

		logger.debug('Usuário autenticado opcionalmente:', {
			uid: request.user.uid,
			email: request.user.email,
		});
	} catch (error) {
		// Em caso de erro, apenas log e continua sem autenticação
		logger.warn('Token inválido na autenticação opcional:', error);
	}
};

// Middleware para verificar roles específicos
export const requireRole = (requiredRole: string) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.user) {
			return reply.status(401).send({
				status: 'error',
				message: 'Usuário não autenticado',
				code: 'USER_NOT_AUTHENTICATED',
			});
		}

		if (request.user.role !== requiredRole && request.user.role !== 'admin') {
			return reply.status(403).send({
				status: 'error',
				message: `Acesso negado. Role necessária: ${requiredRole}`,
				code: 'INSUFFICIENT_PERMISSIONS',
			});
		}
	};
};

// Middleware para verificar se usuário é admin
export const requireAdmin = requireRole('admin');

// Middleware para verificar se email foi verificado
export const requireEmailVerified = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	if (!request.user) {
		return reply.status(401).send({
			status: 'error',
			message: 'Usuário não autenticado',
			code: 'USER_NOT_AUTHENTICATED',
		});
	}

	if (!request.user.emailVerified) {
		return reply.status(403).send({
			status: 'error',
			message: 'Email não verificado. Verifique seu email antes de continuar.',
			code: 'EMAIL_NOT_VERIFIED',
		});
	}
};
