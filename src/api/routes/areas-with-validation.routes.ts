import { Router } from 'express';
import { AreaController } from '../../modules/areas/controllers/AreaController';
import { validateSchema, validateQuery, validateParams } from '../middlewares/validation.middleware';
import { areaCreateSchema, areaUpdateSchema, areaQuerySchema, mongoIdSchema } from '../../shared/validation/schemas';

const router = Router();
const areaController = new AreaController();

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Listar todas as áreas
 *     description: Retorna uma lista paginada de todas as áreas cadastradas com opções de filtro e ordenação
 *     tags: [Áreas]
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
 *         description: Busca por nome ou descrição da área
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do cliente
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativa, inativa, manutencao]
 *         description: Filtrar por status da área
 *       - in: query
 *         name: unidadeMedida
 *         schema:
 *           type: string
 *           enum: [hectares, alqueires, m²]
 *         description: Filtrar por unidade de medida
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nome, tamanho, dataCriacao, dataAtualizacao]
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
 *         description: Lista de áreas retornada com sucesso
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
 *                         $ref: '#/components/schemas/Area'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', 
  validateQuery(areaQuerySchema),
  (req, res) => areaController.index(req, res)
);

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *     summary: Buscar área por ID
 *     description: Retorna os detalhes de uma área específica
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da área
 *         example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Área encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', 
  validateParams(mongoIdSchema),
  (req, res) => areaController.show(req, res)
);

/**
 * @swagger
 * /api/areas:
 *   post:
 *     summary: Criar nova área
 *     description: Cria uma nova área para um cliente
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AreaInput'
 *           examples:
 *             area_soja:
 *               summary: Área para plantio de soja
 *               value:
 *                 nome: "Área Norte - Soja"
 *                 descricao: "Área destinada ao plantio de soja, com solo argiloso"
 *                 tamanho: 50.5
 *                 unidadeMedida: "hectares"
 *                 coordenadas:
 *                   latitude: -23.5505
 *                   longitude: -46.6333
 *                 clienteId: "64a1b2c3d4e5f6789012340"
 *                 status: "ativa"
 *             area_milho:
 *               summary: Área para plantio de milho
 *               value:
 *                 nome: "Área Sul - Milho"
 *                 descricao: "Área com irrigação para cultivo de milho"
 *                 tamanho: 25.8
 *                 unidadeMedida: "hectares"
 *                 clienteId: "64a1b2c3d4e5f6789012340"
 *                 status: "ativa"
 *     responses:
 *       201:
 *         description: Área criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', 
  validateSchema(areaCreateSchema),
  (req, res) => areaController.store(req, res)
);

/**
 * @swagger
 * /api/areas/{id}:
 *   put:
 *     summary: Atualizar área
 *     description: Atualiza os dados de uma área existente
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da área
 *         example: "64a1b2c3d4e5f6789012345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AreaInput'
 *           examples:
 *             atualizacao_completa:
 *               summary: Atualização completa da área
 *               value:
 *                 nome: "Área Norte - Soja Premium"
 *                 descricao: "Área renovada para soja de alta produtividade"
 *                 tamanho: 55.0
 *                 unidadeMedida: "hectares"
 *                 coordenadas:
 *                   latitude: -23.5505
 *                   longitude: -46.6333
 *                 status: "ativa"
 *             atualizacao_parcial:
 *               summary: Atualização apenas do status
 *               value:
 *                 status: "manutencao"
 *     responses:
 *       200:
 *         description: Área atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Area'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', 
  validateParams(mongoIdSchema),
  validateSchema(areaUpdateSchema),
  (req, res) => areaController.update(req, res)
);

/**
 * @swagger
 * /api/areas/{id}:
 *   delete:
 *     summary: Excluir área
 *     description: Remove uma área do sistema (soft delete)
 *     tags: [Áreas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da área
 *         example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Área excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Área excluída com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', 
  validateParams(mongoIdSchema),
  (req, res) => areaController.delete(req, res)
);

export default router;
