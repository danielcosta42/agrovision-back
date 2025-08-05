import { Router } from 'express';
import { UserController } from '../../modules/users/controllers/UserController';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários
 *     description: Retorna uma lista paginada de usuários com base nas permissões do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por nome ou email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, manager, operator, viewer]
 *         description: Filtrar por papel do usuário
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativo, inativo, suspenso]
 *         description: Filtrar por status do usuário
 *       - in: query
 *         name: tipoAcesso
 *         schema:
 *           type: string
 *           enum: [global, cliente-especifico]
 *         description: Filtrar por tipo de acesso
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *         description: Filtrar usuários vinculados a um cliente específico
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nome, email, dataCriacao, ultimoLogin]
 *           default: dataCriacao
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', (req, res) => userController.index(req, res));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     description: Retorna os detalhes de um usuário específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', (req, res) => userController.show(req, res));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Criar novo usuário
 *     description: Cadastra um novo usuário no sistema com controle de acesso por cliente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao.silva@email.com"
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: "senha123"
 *               telefone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, operator, viewer]
 *                 default: "viewer"
 *                 example: "operator"
 *               tipoAcesso:
 *                 type: string
 *                 enum: [global, cliente-especifico]
 *                 default: "cliente-especifico"
 *                 example: "cliente-especifico"
 *               clientesVinculados:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011"]
 *                 description: IDs dos clientes que o usuário pode acessar
 *               permissoes:
 *                 type: object
 *                 properties:
 *                   areas:
 *                     type: object
 *                     properties:
 *                       visualizar:
 *                         type: boolean
 *                       criar:
 *                         type: boolean
 *                       editar:
 *                         type: boolean
 *                       excluir:
 *                         type: boolean
 *                   clientes:
 *                     type: object
 *                     properties:
 *                       visualizar:
 *                         type: boolean
 *                       criar:
 *                         type: boolean
 *                       editar:
 *                         type: boolean
 *                       excluir:
 *                         type: boolean
 *                   culturas:
 *                     type: object
 *                     properties:
 *                       visualizar:
 *                         type: boolean
 *                       criar:
 *                         type: boolean
 *                       editar:
 *                         type: boolean
 *                       excluir:
 *                         type: boolean
 *                   usuarios:
 *                     type: object
 *                     properties:
 *                       visualizar:
 *                         type: boolean
 *                       criar:
 *                         type: boolean
 *                       editar:
 *                         type: boolean
 *                       excluir:
 *                         type: boolean
 *                   relatorios:
 *                     type: object
 *                     properties:
 *                       visualizar:
 *                         type: boolean
 *                       exportar:
 *                         type: boolean
 *           examples:
 *             admin_global:
 *               summary: Usuário Administrador Global
 *               value:
 *                 nome: "Admin Sistema"
 *                 email: "admin@agrovision.com"
 *                 senha: "admin123"
 *                 telefone: "(11) 99999-0000"
 *                 role: "admin"
 *                 tipoAcesso: "global"
 *             operator_cliente:
 *               summary: Operador de Cliente Específico
 *               value:
 *                 nome: "João Operador"
 *                 email: "joao.operador@email.com"
 *                 senha: "senha123"
 *                 telefone: "(11) 99999-1111"
 *                 role: "operator"
 *                 tipoAcesso: "cliente-especifico"
 *                 clientesVinculados: ["507f1f77bcf86cd799439011"]
 *             viewer_multiplos:
 *               summary: Visualizador com Múltiplos Clientes
 *               value:
 *                 nome: "Maria Visualizadora"
 *                 email: "maria.viewer@email.com"
 *                 senha: "senha123"
 *                 role: "viewer"
 *                 tipoAcesso: "cliente-especifico"
 *                 clientesVinculados: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', (req, res) => userController.store(req, res));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     description: Atualiza os dados de um usuário existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, operator, viewer]
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, suspenso]
 *               tipoAcesso:
 *                 type: string
 *                 enum: [global, cliente-especifico]
 *               clientesVinculados:
 *                 type: array
 *                 items:
 *                   type: string
 *               permissoes:
 *                 type: object
 *                 description: Objeto com permissões específicas por módulo
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', (req, res) => userController.update(req, res));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     description: Remove um usuário do sistema (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', (req, res) => userController.delete(req, res));

/**
 * @swagger
 * /api/users/{id}/change-password:
 *   put:
 *     summary: Alterar senha do usuário
 *     description: Permite alterar a senha de um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - novaSenha
 *             properties:
 *               novaSenha:
 *                 type: string
 *                 minLength: 6
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/change-password', (req, res) => userController.changePassword(req, res));

/**
 * @swagger
 * /api/users/by-client/{clienteId}:
 *   get:
 *     summary: Listar usuários por cliente
 *     description: Retorna todos os usuários que têm acesso a um cliente específico
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/by-client/:clienteId', (req, res) => userController.getUsersByClient(req, res));

export default router;
