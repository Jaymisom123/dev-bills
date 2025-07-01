import { TransactionType } from '@prisma/client';
import { z } from 'zod';

// Schema para criar categoria
export const createCategorySchema = z.object({
	name: z
		.string()
		.min(1, 'Nome é obrigatório')
		.max(50, 'Nome muito longo')
		.trim(),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Cor deve estar no formato hex (#FFFFFF)',
		),
	type: z.nativeEnum(TransactionType, {
		errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' }),
	}),
});

// Schema para atualizar categoria
export const updateCategorySchema = z.object({
	name: z
		.string()
		.min(1, 'Nome é obrigatório')
		.max(50, 'Nome muito longo')
		.trim()
		.optional(),
	color: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			'Cor deve estar no formato hex (#FFFFFF)',
		)
		.optional(),
	type: z
		.nativeEnum(TransactionType, {
			errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' }),
		})
		.optional(),
});

// Schema para parâmetros com ID
export const categoryParamsSchema = z.object({
	id: z.string().min(1, 'ID é obrigatório'),
});

// Schema para query de categorias
export const categoriesQuerySchema = z.object({
	type: z.nativeEnum(TransactionType).optional(),
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

// Types derivados dos schemas
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryParamsInput = z.infer<typeof categoryParamsSchema>;
export type CategoriesQueryInput = z.infer<typeof categoriesQuerySchema>;
