// Autenticação
export {
	authMiddleware,
	optionalAuthMiddleware,
	requireAdmin,
	requireEmailVerified,
	requireRole,
	type AuthenticatedUser,
} from './auth.middleware';

// Rate limiting
export { rateLimitMiddleware } from './rateLimit.middleware';

// Validation
export { validationMiddleware } from './validation.middleware';
