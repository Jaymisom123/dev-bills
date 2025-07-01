import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const connectPrisma = async () => {
	try {
		await prisma.$connect();
		logger.database('Conexão com banco de dados estabelecida');
	} catch (error) {
		logger.error('Erro na conexão com banco de dados', error);
		throw error;
	}
};

export default prisma;
