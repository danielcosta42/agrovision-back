/**
 * @swagger
 * tags:
 *   - name: Clientes
 *     description: Operações relacionadas aos clientes/produtores rurais
 *   - name: Áreas
 *     description: Gestão de áreas de plantio e terrenos
 *   - name: Culturas
 *     description: Cadastro e gestão de tipos de culturas
 *   - name: Users
 *     description: Gerenciamento de usuários e controle de acesso por cliente
 *   - name: Pragas
 *     description: Monitoramento e controle de pragas
 *   - name: Perdas
 *     description: Registro e análise de perdas na produção
 *   - name: Autenticação
 *     description: Endpoints de autenticação e autorização
 *   - name: Sistema
 *     description: Endpoints do sistema (health check, status)
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificação de saúde da API
 *     description: Endpoint para verificar se a API está funcionando corretamente
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   description: Tempo de atividade em segundos
 *                   example: 3600
 */

export {};
