import { z } from 'zod';

// Schema para criar usuário
export const createUserSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z
		.string()
		.min(6, 'Senha deve ter pelo menos 6 caracteres')
		.max(128, 'Senha muito longa'),
	displayName: z
		.string()
		.min(2, 'Nome deve ter pelo menos 2 caracteres')
		.max(100, 'Nome muito longo')
		.optional(),
	disabled: z.boolean().optional().default(false),
});

// Schema para atualizar usuário
export const updateUserSchema = z.object({
	email: z.string().email('Email inválido').optional(),
	displayName: z
		.string()
		.min(2, 'Nome deve ter pelo menos 2 caracteres')
		.max(100, 'Nome muito longo')
		.optional(),
	disabled: z.boolean().optional(),
	emailVerified: z.boolean().optional(),
});

// Schema para parâmetros com UID
export const userParamsSchema = z.object({
	uid: z.string().min(1, 'UID é obrigatório'),
});

// Schema para definir claims/roles
export const setClaimsSchema = z.object({
	claims: z.object({
		role: z.enum(['user', 'admin', 'moderator']).optional(),
		permissions: z.array(z.string()).optional(),
		customData: z.record(z.unknown()).optional(),
	}),
});

// Schema para listar usuários
export const listUsersQuerySchema = z.object({
	maxResults: z
		.string()
		.transform(Number)
		.refine((n) => n > 0 && n <= 1000, 'maxResults deve ser entre 1 e 1000')
		.optional()
		.default('100'),
	pageToken: z.string().optional(),
});

// Schema para busca de usuários
export const searchUsersQuerySchema = z.object({
	email: z.string().email('Email inválido').optional(),
	displayName: z.string().min(1).optional(),
	disabled: z
		.string()
		.transform((val) => val === 'true')
		.optional(),
	emailVerified: z
		.string()
		.transform((val) => val === 'true')
		.optional(),
});

// Types derivados dos schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserParamsInput = z.infer<typeof userParamsSchema>;
export type SetClaimsInput = z.infer<typeof setClaimsSchema>;
export type ListUsersQueryInput = z.infer<typeof listUsersQuerySchema>;
export type SearchUsersQueryInput = z.infer<typeof searchUsersQuerySchema>;
