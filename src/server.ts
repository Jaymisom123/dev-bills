import app from './app';
import { env, isDevelopment } from './config/env';
import { connectPrisma } from './config/prisma';
import { createGlobalCategories } from './services/globalCategory.service';
import logger from './utils/logger';

const startServer = async () => {
	try {
		// Conectar ao Prisma
		await connectPrisma();

		// Tentar criar categorias globais (não bloquear se falhar)
		try {
			await createGlobalCategories();
		} catch (categoryError: unknown) {
			logger.warn(
				'Não foi possível criar categorias globais:',
				categoryError instanceof Error
					? categoryError.message
					: 'Erro desconhecido',
			);
		}

		// Iniciar servidor
		await app.listen({
			port: env.PORT,
			host: '0.0.0.0', // Permite conexões externas
		});

		logger.startup(`Servidor rodando na porta ${env.PORT}`);
		logger.info(`API disponível em: http://localhost:${env.PORT}/api/health`);
		logger.debug(
			`Modo de desenvolvimento: ${isDevelopment ? 'Ativo' : 'Inativo'}`,
		);
	} catch (err: unknown) {
		logger.error(
			'Erro ao iniciar servidor:',
			err instanceof Error ? err.message : 'Erro desconhecido',
		);
		app.log.error(err);
		process.exit(1);
	}
};

startServer();
