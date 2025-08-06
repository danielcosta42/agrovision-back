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
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Fazenda São José"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contato@fazendasaojose.com.br"
 *               telefone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               cnpj:
 *                 type: string
 *                 example: "12.345.678/0001-90"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-01"
 *               responsavel:
 *                 type: string
 *                 example: "João Silva"
 *               tipoProducao:
 *                 type: string
 *                 enum: [grãos, pecuária, mista, frutas, verduras]
 *                 example: "grãos"
 *               areaTotalHectares:
 *                 type: number
 *                 minimum: 0
 *                 example: 150.5
 *               observacoes:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Cliente desde 2020, produção de soja e milho"
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, suspenso]
 *                 example: "ativo"
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                     example: "Estrada Rural, Km 15"
 *                   numero:
 *                     type: string
 *                     example: "S/N"
 *                   complemento:
 *                     type: string
 *                     example: "Zona Rural"
 *                   bairro:
 *                     type: string
 *                     example: "Centro"
 *                   cidade:
 *                     type: string
 *                     example: "Ribeirão Preto"
 *                   estado:
 *                     type: string
 *                     example: "SP"
 *                   cep:
 *                     type: string
 *                     example: "14000-000"
 *           examples:
 *             fazenda_completa:
 *               summary: Cliente Fazenda Completo
 *               value:
 *                 nome: "Fazenda São José"
 *                 email: "contato@fazendasaojose.com.br"
 *                 telefone: "(16) 3333-4444"
 *                 cnpj: "12.345.678/0001-90"
 *                 responsavel: "João da Silva"
 *                 tipoProducao: "grãos"
 *                 areaTotalHectares: 150.5
 *                 observacoes: "Cliente desde 2020, produção de soja e milho"
 *                 status: "ativo"
 *                 endereco:
 *                   rua: "Estrada Rural, Km 15"
 *                   numero: "S/N"
 *                   complemento: "Zona Rural"
 *                   bairro: "Centro"
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
 *               cnpj:
 *                 type: string
 *               cpf:
 *                 type: string
 *               responsavel:
 *                 type: string
 *               tipoProducao:
 *                 type: string
 *                 enum: [grãos, pecuária, mista, frutas, verduras]
 *               areaTotalHectares:
 *                 type: number
 *                 minimum: 0
 *               observacoes:
 *                 type: string
 *                 maxLength: 1000
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, suspenso]
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   complemento:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   cep:
 *                     type: string
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
