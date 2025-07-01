import type { FastifyReply, FastifyRequest } from 'fastify';

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		// Simulação de usuário logado - implementar autenticação real depois
		const user = {
			id: '1',
			name: 'João Silva',
			email: 'joao@exemplo.com',
			createdAt: new Date().toISOString(),
		};

		return reply.status(200).send({
			status: 'success',
			data: { user },
		});
	} catch (error) {
		return reply.status(500).send({
			status: 'error',
			message: 'Erro ao buscar usuário',
		});
	}
};
