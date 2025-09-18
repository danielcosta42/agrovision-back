import { Router } from 'express';
import { PropriedadeController } from '../../modules/propriedades/controllers/PropriedadeController';

const propriedadesRouter = Router();
const controller = new PropriedadeController();

/**
 * @swagger
 * /api/propriedades:
 *   get:
 *     summary: Listar todas as propriedades
 *     description: Retorna uma lista paginada de todas as propriedades cadastradas com opções de filtro e ordenação
 *     tags: [Propriedades]
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
 *         description: Busca por nome ou município da propriedade
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
 *         description: Filtrar por status da propriedade
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nome, area_total_ha, municipio, dataCriacao, dataAtualizacao]
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
 *         description: Lista de propriedades retornada com sucesso
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
 *                         $ref: '#/components/schemas/Propriedade'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
propriedadesRouter.get('/', (req, res) => controller.index(req, res));

/**
 * @swagger
 * /api/propriedades/{id}:
 *   get:
 *     summary: Buscar propriedade por ID
 *     description: Retorna os detalhes de uma propriedade específica
 *     tags: [Propriedades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da propriedade
 *         example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Propriedade encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Propriedade'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
propriedadesRouter.get('/:id', (req, res) => controller.show(req, res));

/**
 * @swagger
 * /api/propriedades:
 *   post:
 *     summary: Criar nova propriedade
 *     description: Cria uma nova propriedade para um cliente
 *     tags: [Propriedades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropriedadeInput'
 *           examples:
 *             propriedade_exemplo:
 *               summary: Propriedade exemplo
 *               value:
 *                 nome: "Fazenda Primavera"
 *                 municipio: "Uberlândia"
 *                 uf: "MG"
 *                 area_total_ha: 120.5
 *                 clienteId: "64a1b2c3d4e5f6789012340"
 *                 status: "ativa"
 *                 centroide:
 *                   latitude: -18.9146
 *                   longitude: -48.2749
 *                 geom:
 *                   type: "Polygon"
 *                   coordinates: [[[ -18.91, -48.27 ], [ -18.92, -48.28 ], [ -18.93, -48.29 ], [ -18.91, -48.27 ]]]
 *     responses:
 *       201:
 *         description: Propriedade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Propriedade'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
propriedadesRouter.post('/', (req, res) => controller.store(req, res));

/**
 * @swagger
 * /api/propriedades/{id}:
 *   put:
 *     summary: Atualizar propriedade
 *     description: Atualiza os dados de uma propriedade existente
 *     tags: [Propriedades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da propriedade
 *         example: "64a1b2c3d4e5f6789012345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropriedadeInput'
 *           examples:
 *             atualizacao_completa:
 *               summary: Atualização completa da propriedade
 *               value:
 *                 nome: "Fazenda Primavera Atualizada"
 *                 municipio: "Uberlândia"
 *                 uf: "MG"
 *                 area_total_ha: 130.0
 *                 status: "ativa"
 *                 centroide:
 *                   latitude: -18.9146
 *                   longitude: -48.2749
 *                 geom:
 *                   type: "Polygon"
 *                   coordinates: [[[ -18.91, -48.27 ], [ -18.92, -48.28 ], [ -18.93, -48.29 ], [ -18.91, -48.27 ]]]
 *     responses:
 *       200:
 *         description: Propriedade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Propriedade'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
propriedadesRouter.put('/:id', (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/propriedades/{id}:
 *   delete:
 *     summary: Excluir propriedade
 *     description: Remove uma propriedade do sistema (soft delete)
 *     tags: [Propriedades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da propriedade
 *         example: "64a1b2c3d4e5f6789012345"
 *     responses:
 *       200:
 *         description: Propriedade excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Propriedade excluída com sucesso"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
propriedadesRouter.delete('/:id', (req, res) => controller.delete(req, res));

export default propriedadesRouter;
