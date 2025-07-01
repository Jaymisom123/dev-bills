import { isDevelopment } from '../config/env';

interface LogLevel {
	ERROR: 'error';
	WARN: 'warn';
	INFO: 'info';
	DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
	ERROR: 'error',
	WARN: 'warn',
	INFO: 'info',
	DEBUG: 'debug',
};

class Logger {
	private shouldLog(level: keyof LogLevel): boolean {
		// Em produção, apenas logs de erro e warn
		if (!isDevelopment) {
			return level === 'ERROR' || level === 'WARN';
		}
		// Em desenvolvimento, todos os logs
		return true;
	}

	error(message: string, ...args: unknown[]): void {
		console.error(`❌ ${message}`, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		if (this.shouldLog('WARN')) {
			console.warn(`⚠️ ${message}`, ...args);
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.shouldLog('INFO')) {
			console.log(`ℹ️ ${message}`, ...args);
		}
	}

	success(message: string, ...args: unknown[]): void {
		if (this.shouldLog('INFO')) {
			console.log(`✅ ${message}`, ...args);
		}
	}

	debug(message: string, ...args: unknown[]): void {
		if (this.shouldLog('DEBUG')) {
			console.log(`🔧 ${message}`, ...args);
		}
	}

	startup(message: string, ...args: unknown[]): void {
		if (this.shouldLog('INFO')) {
			console.log(`🚀 ${message}`, ...args);
		}
	}

	database(message: string, ...args: unknown[]): void {
		if (this.shouldLog('INFO')) {
			console.log(`💾 ${message}`, ...args);
		}
	}

	firebase(message: string, ...args: unknown[]): void {
		if (this.shouldLog('INFO')) {
			console.log(`🔥 ${message}`, ...args);
		}
	}
}

export const logger = new Logger();
export default logger;
