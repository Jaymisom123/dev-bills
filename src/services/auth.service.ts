import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuth, verifyToken } from '../config/firebase';
import logger from '../utils/logger';

// Interface para usuário autenticado
export interface AuthenticatedUser {
	uid: string;
	email?: string;
	name?: string;
	emailVerified: boolean;
}

// Estender a interface do Fastify para incluir o usuário
declare module 'fastify' {
	interface FastifyRequest {
		user?: AuthenticatedUser;
	}
}

// Middleware de autenticação Firebase
export const firebaseAuthMiddleware = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const authorization = request.headers.authorization;

		if (!authorization) {
			return reply.status(401).send({
				error: 'Token de autorização não fornecido',
				message: 'Cabeçalho Authorization é obrigatório',
			});
		}

		// Extrair token do cabeçalho "Bearer TOKEN"
		const token = authorization.split(' ')[1];

		if (!token) {
			return reply.status(401).send({
				error: 'Token mal formatado',
				message: 'Formato esperado: Bearer <token>',
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
		} as AuthenticatedUser;
	} catch (error) {
		logger.error('Erro na autenticação Firebase:', error);
		return reply.status(401).send({
			error: 'Token inválido',
			message: 'Falha na verificação do token Firebase',
		});
	}
};

// Serviço para criar usuário personalizado
export const createCustomUser = async (userData: {
	email: string;
	password: string;
	displayName?: string;
	disabled?: boolean;
}) => {
	try {
		const auth = getAuth();

		const userRecord = await auth.createUser({
			email: userData.email,
			password: userData.password,
			displayName: userData.displayName,
			disabled: userData.disabled || false,
		});

		logger.success('Usuário criado:', userRecord.uid);
		return userRecord;
	} catch (error) {
		logger.error('Erro ao criar usuário:', error);
		throw error;
	}
};

// Serviço para buscar usuário por UID
export const getUserByUid = async (uid: string) => {
	try {
		const auth = getAuth();
		const userRecord = await auth.getUser(uid);
		return userRecord;
	} catch (error) {
		logger.error('Erro ao buscar usuário:', error);
		throw error;
	}
};

// Serviço para buscar usuário por email
export const getUserByEmail = async (email: string) => {
	try {
		const auth = getAuth();
		const userRecord = await auth.getUserByEmail(email);
		return userRecord;
	} catch (error) {
		logger.error('Erro ao buscar usuário por email:', error);
		throw error;
	}
};

// Serviço para atualizar usuário
export const updateUser = async (
	uid: string,
	updates: {
		email?: string;
		displayName?: string;
		disabled?: boolean;
		emailVerified?: boolean;
	},
) => {
	try {
		const auth = getAuth();
		const userRecord = await auth.updateUser(uid, updates);

		logger.success('Usuário atualizado:', userRecord.uid);
		return userRecord;
	} catch (error) {
		logger.error('Erro ao atualizar usuário:', error);
		throw error;
	}
};

// Serviço para deletar usuário
export const deleteUser = async (uid: string) => {
	try {
		const auth = getAuth();
		await auth.deleteUser(uid);

		logger.success('Usuário deletado:', uid);
	} catch (error) {
		logger.error('Erro ao deletar usuário:', error);
		throw error;
	}
};

// Serviço para definir claims customizados (roles)
export const setCustomClaims = async (uid: string, claims: object) => {
	try {
		const auth = getAuth();
		await auth.setCustomUserClaims(uid, claims);

		logger.success('Claims atualizados:', { uid, claims });
	} catch (error) {
		logger.error('Erro ao definir claims:', error);
		throw error;
	}
};

// Serviço para listar usuários com paginação
export const listUsers = async (maxResults = 1000, pageToken?: string) => {
	try {
		const auth = getAuth();
		const listUsersResult = await auth.listUsers(maxResults, pageToken);

		return {
			users: listUsersResult.users,
			pageToken: listUsersResult.pageToken,
		};
	} catch (error) {
		logger.error('Erro ao listar usuários:', error);
		throw error;
	}
};
