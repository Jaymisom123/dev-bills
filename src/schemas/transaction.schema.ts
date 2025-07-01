import { TransactionType } from '@prisma/client';
import { z } from 'zod';

// Schema para criar transação
export const createTransactionSchema = z.object({
	amount: z
		.number()
		.positive('Valor deve ser maior que zero')
		.max(999999999, 'Valor muito alto'),
	description: z
		.string()
		.min(1, 'Descrição é obrigatória')
		.max(100, 'Descrição muito longa')
		.trim(),
	categoryId: z.string().min(1, 'Categoria é obrigatória'),
	type: z.nativeEnum(TransactionType, {
		errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' }),
	}),
	date: z
		.string()
		.datetime('Data deve estar no formato ISO 8601')
		.transform((date) => new Date(date)),
	userId: z.string().min(1, 'ID do usuário é obrigatório').optional(),
});

// Schema para atualizar transação
export const updateTransactionSchema = z.object({
	amount: z
		.number()
		.positive('Valor deve ser maior que zero')
		.max(999999999, 'Valor muito alto')
		.optional(),
	description: z
		.string()
		.min(1, 'Descrição é obrigatória')
		.max(100, 'Descrição muito longa')
		.trim()
		.optional(),
	categoryId: z.string().min(1, 'Categoria é obrigatória').optional(),
	type: z
		.nativeEnum(TransactionType, {
			errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' }),
		})
		.optional(),
	date: z
		.string()
		.datetime('Data deve estar no formato ISO 8601')
		.transform((date) => new Date(date))
		.optional(),
});

// Schema para parâmetros com ID
export const transactionParamsSchema = z.object({
	id: z.string().min(1, 'ID é obrigatório'),
});

// Schema para query de transações
export const transactionsQuerySchema = z.object({
	type: z.nativeEnum(TransactionType).optional(),
	categoryId: z.string().optional(),
	userId: z.string().optional(),
	startDate: z
		.string()
		.datetime('Data inicial deve estar no formato ISO 8601')
		.transform((date) => new Date(date))
		.optional(),
	endDate: z
		.string()
		.datetime('Data final deve estar no formato ISO 8601')
		.transform((date) => new Date(date))
		.optional(),
	minAmount: z
		.string()
		.transform(Number)
		.refine((n) => n >= 0, 'Valor mínimo deve ser positivo')
		.optional(),
	maxAmount: z
		.string()
		.transform(Number)
		.refine((n) => n >= 0, 'Valor máximo deve ser positivo')
		.optional(),
	page: z
		.string()
		.transform(Number)
		.refine((n) => n > 0, 'Página deve ser maior que 0')
		.optional()
		.default('1'),
	limit: z
		.string()
		.transform(Number)
		.refine((n) => n > 0 && n <= 100, 'Limite deve ser entre 1 e 100')
		.optional()
		.default('20'),
	search: z.string().optional(),
});

// Schema para query de balanço
export const balanceQuerySchema = z.object({
	userId: z.string().optional(),
	startDate: z
		.string()
		.datetime('Data inicial deve estar no formato ISO 8601')
		.transform((date) => new Date(date))
		.optional(),
	endDate: z
		.string()
		.datetime('Data final deve estar no formato ISO 8601')
		.transform((date) => new Date(date))
		.optional(),
	categoryId: z.string().optional(),
});

// Types derivados dos schemas
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionParamsInput = z.infer<typeof transactionParamsSchema>;
export type TransactionsQueryInput = z.infer<typeof transactionsQuerySchema>;
export type BalanceQueryInput = z.infer<typeof balanceQuerySchema>;
