import type { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../utils/logger';

interface RateLimitOptions {
	windowMs: number; // Janela de tempo em ms
	maxRequests: number; // Máximo de requests na janela
	message?: string;
	skipSuccessfulRequests?: boolean;
	keyGenerator?: (request: FastifyRequest) => string;
}

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

const store: RateLimitStore = {};

// Limpar registros expirados a cada minuto
setInterval(() => {
	const now = Date.now();
	for (const key in store) {
		if (store[key].resetTime < now) {
			delete store[key];
		}
	}
}, 60 * 1000);

export const rateLimitMiddleware = (options: RateLimitOptions) => {
	const {
		windowMs = 15 * 60 * 1000, // 15 minutos por padrão
		maxRequests = 100, // 100 requests por padrão
		message = 'Muitas tentativas. Tente novamente mais tarde.',
		skipSuccessfulRequests = false,
		keyGenerator = (request) => request.ip || 'unknown',
	} = options;

	return async (request: FastifyRequest, reply: FastifyReply) => {
		const key = keyGenerator(request);
		const now = Date.now();
		const resetTime = now + windowMs;

		// Inicializar ou resetar contador se expirado
		if (!store[key] || store[key].resetTime < now) {
			store[key] = {
				count: 0,
				resetTime,
			};
		}

		// Incrementar contador
		store[key].count++;

		// Verificar se excedeu o limite
		if (store[key].count > maxRequests) {
			const timeRemaining = Math.ceil((store[key].resetTime - now) / 1000);

			logger.warn('Rate limit excedido:', {
				key,
				count: store[key].count,
				maxRequests,
				timeRemaining,
			});

			return reply.status(429).send({
				status: 'error',
				message,
				code: 'RATE_LIMIT_EXCEEDED',
				retryAfter: timeRemaining,
			});
		}

		// Adicionar headers informativos
		reply.header('X-RateLimit-Limit', maxRequests);
		reply.header('X-RateLimit-Remaining', maxRequests - store[key].count);
		reply.header('X-RateLimit-Reset', Math.ceil(store[key].resetTime / 1000));

		// Log apenas se estiver próximo do limite
		if (store[key].count > maxRequests * 0.8) {
			logger.warn('Aproximando do rate limit:', {
				key,
				count: store[key].count,
				maxRequests,
			});
		}
	};
};

// Presets comuns
export const strictRateLimit = rateLimitMiddleware({
	windowMs: 15 * 60 * 1000, // 15 minutos
	maxRequests: 10, // 10 requests
	message: 'Muitas tentativas. Aguarde 15 minutos.',
});

export const moderateRateLimit = rateLimitMiddleware({
	windowMs: 15 * 60 * 1000, // 15 minutos
	maxRequests: 100, // 100 requests
});

export const lightRateLimit = rateLimitMiddleware({
	windowMs: 60 * 1000, // 1 minuto
	maxRequests: 60, // 60 requests por minuto
});
