import dotenv from 'dotenv';
import { z } from 'zod';

// Carregar variáveis de ambiente
dotenv.config();

// Schema de validação das variáveis de ambiente
const envSchema = z.object({
	// Configurações do servidor
	PORT: z
		.string()
		.transform(Number)
		.refine((port) => port > 0 && port < 65536, {
			message: 'PORT deve ser um número entre 1 e 65535',
		})
		.default('3333'),

	NODE_ENV: z.enum(['DEV', 'PROD', 'TEST']).default('DEV'),

	// Configurações do banco de dados
	DATABASE_URL: z
		.string()
		.url('DATABASE_URL deve ser uma URL válida')
		.startsWith('mongodb', 'DATABASE_URL deve começar com mongodb'),

	// Configurações opcionais de autenticação
	JWT_SECRET: z
		.string()
		.min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres')
		.optional(),

	// Configurações de CORS
	CORS_ORIGIN: z
		.string()
		.url('CORS_ORIGIN deve ser uma URL válida')
		.optional()
		.default('http://localhost:5173'),

	// Configurações de logging
	LOG_LEVEL: z
		.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
		.optional()
		.default('warn'),

	// Configurações do Firebase (opcionais)
	FIREBASE_PROJECT_ID: z
		.string()
		.min(1, 'FIREBASE_PROJECT_ID não pode estar vazio')
		.optional(),

	FIREBASE_PRIVATE_KEY: z
		.string()
		.min(1, 'FIREBASE_PRIVATE_KEY não pode estar vazio')
		.optional(),

	FIREBASE_CLIENT_EMAIL: z
		.string()
		.email('FIREBASE_CLIENT_EMAIL deve ser um email válido')
		.optional(),
});

// Validar e parsear as variáveis de ambiente
const parseEnv = () => {
	try {
		const env = envSchema.parse({
			PORT: process.env.PORT,
			NODE_ENV: process.env.NODE_ENV,
			DATABASE_URL: process.env.DATABASE_URL,
			JWT_SECRET: process.env.JWT_SECRET,
			CORS_ORIGIN: process.env.CORS_ORIGIN,
			LOG_LEVEL: process.env.LOG_LEVEL,
			FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
			FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
			FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
		});

		return env;
	} catch (error) {
		console.error('❌ Erro na validação das variáveis de ambiente:');

		if (error instanceof z.ZodError) {
			for (const err of error.errors) {
				console.error(`  - ${err.path.join('.')}: ${err.message}`);
			}
		}

		console.error('\n📝 Verifique seu arquivo .env e tente novamente.');
		console.error('Exemplo de .env necessário:');
		console.error(`
PORT=3333
NODE_ENV=DEV
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/database"
CORS_ORIGIN="http://localhost:3000"
LOG_LEVEL="info"
# Opcionais:
# JWT_SECRET="sua_chave_secreta_de_pelo_menos_32_caracteres"
# FIREBASE_PROJECT_ID="seu-projeto-firebase"
# FIREBASE_PRIVATE_KEY="sua-chave-privada-firebase"
# FIREBASE_CLIENT_EMAIL="email@seu-projeto.iam.gserviceaccount.com"
		`);
		process.exit(1);
	}
};

// Exportar as variáveis validadas
export const env = parseEnv();

// Tipos para TypeScript
export type Env = z.infer<typeof envSchema>;

// Utilitários
export const isDevelopment = env.NODE_ENV === 'DEV';
export const isProduction = env.NODE_ENV === 'PROD';
export const isTest = env.NODE_ENV === 'TEST';

// Validar se Firebase está configurado
export const isFirebaseConfigured = !!(
	env.FIREBASE_PROJECT_ID &&
	env.FIREBASE_PRIVATE_KEY &&
	env.FIREBASE_CLIENT_EMAIL
);
