import { type Category, TransactionType } from '@prisma/client';
import prisma from '../config/prisma';
import logger from '../utils/logger';

type GlobalCategoryInput = Pick<Category, 'name' | 'color' | 'type'>;

const globalCategories: GlobalCategoryInput[] = [
	// Despesas
	{ name: 'Alimentação', color: '#FF5733', type: TransactionType.EXPENSE },
	{ name: 'Transporte', color: '#33A8FF', type: TransactionType.EXPENSE },
	{ name: 'Moradia', color: '#33FF57', type: TransactionType.EXPENSE },
	{ name: 'Saúde', color: '#F033FF', type: TransactionType.EXPENSE },
	{ name: 'Educação', color: '#FF3366', type: TransactionType.EXPENSE },
	{ name: 'Lazer', color: '#FFBA33', type: TransactionType.EXPENSE },
	{ name: 'Compras', color: '#33FFF6', type: TransactionType.EXPENSE },
	{ name: 'Outros', color: '#B033FF', type: TransactionType.EXPENSE },

	// Receitas
	{ name: 'Salário', color: '#33FF57', type: TransactionType.INCOME },
	{ name: 'Freelance', color: '#33A8FF', type: TransactionType.INCOME },
	{ name: 'Investimentos', color: '#FFBA33', type: TransactionType.INCOME },
	{ name: 'Outros', color: '#B033FF', type: TransactionType.INCOME },
];

export const createGlobalCategories = async (): Promise<Category[]> => {
	const createdCategories: Category[] = [];

	for (const category of globalCategories) {
		try {
			const existingCategory = await prisma.category.findFirst({
				where: {
					name: category.name,
					type: category.type,
				},
			});
			if (!existingCategory) {
				const newCategory = await prisma.category.create({
					data: category,
				});
				logger.debug(`Categoria ${category.name} criada`);
				createdCategories.push(newCategory);
			} else {
				logger.debug(`Categoria ${category.name} já existe`);
			}
		} catch (error) {
			logger.error('Erro ao criar categoria global', error);
		}
	}

	logger.info(`${createdCategories.length} categorias globais processadas`);

	return createdCategories;
};
