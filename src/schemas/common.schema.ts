import { z } from 'zod';

// Schema para paginação
export const paginationSchema = z.object({
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
});

// Schema para busca
export const searchSchema = z.object({
	search: z.string().min(1).optional(),
});

// Schema para ID de parâmetro
export const idParamsSchema = z.object({
	id: z.string().min(1, 'ID é obrigatório'),
});

// Schema para datas
export const dateRangeSchema = z.object({
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
});

// Schema para ordenação
export const sortSchema = z.object({
	sortBy: z.string().optional().default('createdAt'),
	sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Schema para resposta padrão de sucesso
export const successResponseSchema = z.object({
	status: z.literal('success'),
	message: z.string().optional(),
	data: z.unknown().optional(),
});

// Schema para resposta padrão de erro
export const errorResponseSchema = z.object({
	status: z.literal('error'),
	message: z.string(),
	code: z.string().optional(),
	errors: z.array(z.unknown()).optional(),
});

// Types derivados dos schemas
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type IdParamsInput = z.infer<typeof idParamsSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type SortInput = z.infer<typeof sortSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
