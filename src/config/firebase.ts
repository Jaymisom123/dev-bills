import path from 'node:path';
import admin from 'firebase-admin';
import logger from '../utils/logger';
import { env, isFirebaseConfigured } from './env';

// Configuração do Firebase Admin
let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = () => {
	try {
		// Se já foi inicializado, retorna a instância existente
		if (firebaseApp) {
			return firebaseApp;
		}

		// Método 1: Usar variáveis de ambiente
		if (isFirebaseConfigured) {
			logger.firebase('Inicializando Firebase com variáveis de ambiente...');

			firebaseApp = admin.initializeApp({
				credential: admin.credential.cert({
					projectId: env.FIREBASE_PROJECT_ID,
					privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
					clientEmail: env.FIREBASE_CLIENT_EMAIL,
				}),
				projectId: env.FIREBASE_PROJECT_ID,
			});
		}
		// Método 2: Usar arquivo de service account JSON
		else {
			logger.firebase(
				'Inicializando Firebase com arquivo de service account...',
			);

			const serviceAccountPath = path.join(
				process.cwd(),
				'dev-bills-87da4-firebase-adminsdk-fbsvc-fc4d462a34.json',
			);

			firebaseApp = admin.initializeApp({
				credential: admin.credential.cert(serviceAccountPath),
			});
		}

		logger.success('Firebase Admin SDK inicializado com sucesso!');
		return firebaseApp;
	} catch (error) {
		logger.error('Erro ao inicializar Firebase:', error);
		throw new Error('Falha na inicialização do Firebase Admin SDK');
	}
};

// Função para obter a instância do Firebase
export const getFirebaseApp = (): admin.app.App => {
	if (!firebaseApp) {
		throw new Error(
			'Firebase não foi inicializado. Chame initializeFirebase() primeiro.',
		);
	}
	return firebaseApp;
};

// Serviços específicos do Firebase
export const getFirestore = () => {
	const app = getFirebaseApp();
	return app.firestore();
};

export const getAuth = () => {
	const app = getFirebaseApp();
	return app.auth();
};

export const getStorage = () => {
	const app = getFirebaseApp();
	return app.storage();
};

// Utilitários de autenticação
export const verifyToken = async (idToken: string) => {
	try {
		const auth = getAuth();
		const decodedToken = await auth.verifyIdToken(idToken);
		return decodedToken;
	} catch (error) {
		logger.error('Erro ao verificar token:', error);
		throw new Error('Token inválido');
	}
};

// Exportar tipos úteis
export type DecodedIdToken = admin.auth.DecodedIdToken;
export type UserRecord = admin.auth.UserRecord;
