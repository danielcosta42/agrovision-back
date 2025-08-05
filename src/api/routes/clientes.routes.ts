import { Router } from 'express';
import { ClienteController } from '../../modules/clientes/controllers/ClienteController';

const router = Router();
const clienteController = new ClienteController();

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Listar todos os clientes
 *     description: Retorna uma lista paginada de todos os clientes cadastrados
 *     tags: [Clientes]
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
 *         description: Busca por nome, email ou documento
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativo, inativo, suspenso]
 *         description: Filtrar por status do cliente
 *       - in: query
 *         name: tipoDocumento
 *         schema:
 *           type: string
 *           enum: [CPF, CNPJ]
 *         description: Filtrar por tipo de documento
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nome, email, dataCriacao]
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
 *         description: Lista de clientes retornada com sucesso
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
 *                         $ref: '#/components/schemas/Cliente'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', (req, res) => clienteController.index(req, res));

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Buscar cliente por ID
 *     description: Retorna os detalhes de um cliente específico
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', (req, res) => clienteController.show(req, res));

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Criar novo cliente
 *     description: Cadastra um novo cliente no sistema
 *     tags: [Clientes]
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
 *               - telefone
 *               - documento
 *               - tipoDocumento
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
 *               telefone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               documento:
 *                 type: string
 *                 example: "123.456.789-01"
 *               tipoDocumento:
 *                 type: string
 *                 enum: [CPF, CNPJ]
 *                 example: "CPF"
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                     example: "Rua das Flores, 123"
 *                   cidade:
 *                     type: string
 *                     example: "São Paulo"
 *                   estado:
 *                     type: string
 *                     example: "SP"
 *                   cep:
 *                     type: string
 *                     example: "01234-567"
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, suspenso]
 *                 default: "ativo"
 *           examples:
 *             pessoa_fisica:
 *               summary: Cliente Pessoa Física
 *               value:
 *                 nome: "João Silva"
 *                 email: "joao.silva@email.com"
 *                 telefone: "(11) 99999-9999"
 *                 documento: "123.456.789-01"
 *                 tipoDocumento: "CPF"
 *                 endereco:
 *                   rua: "Rua das Flores, 123"
 *                   cidade: "São Paulo"
 *                   estado: "SP"
 *                   cep: "01234-567"
 *             pessoa_juridica:
 *               summary: Cliente Pessoa Jurídica
 *               value:
 *                 nome: "Fazenda São José Ltda"
 *                 email: "contato@fazendaosanjose.com.br"
 *                 telefone: "(11) 3333-4444"
 *                 documento: "12.345.678/0001-99"
 *                 tipoDocumento: "CNPJ"
 *                 endereco:
 *                   rua: "Estrada Rural, Km 15"
 *                   cidade: "Ribeirão Preto"
 *                   estado: "SP"
 *                   cep: "14000-000"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', (req, res) => clienteController.store(req, res));

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     description: Atualiza os dados de um cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
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
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   cep:
 *                     type: string
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, suspenso]
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', (req, res) => clienteController.update(req, res));

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Excluir cliente
 *     description: Remove um cliente do sistema (soft delete)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do cliente
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', (req, res) => clienteController.delete(req, res));

export default router;
